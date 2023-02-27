/* eslint-disable @angular-eslint/directive-selector */
/* eslint-disable @angular-eslint/no-input-rename */
/* eslint-disable max-classes-per-file */
import {
  ChangeDetectorRef,
  Directive,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import {
  AsyncSubject,
  combineLatest,
  forkJoin,
  isObservable,
  Observable,
  ObservableInput as RxJsObservableInput,
  Subscribable,
  Subscription,
  zip,
} from 'rxjs';
import { concatMapTo, map } from 'rxjs/operators';
import { observify } from '../functions';
import {
  NgSubscribeBehavior,
  NG_SUBSCRIBE_EXCEPTION_BEHAVIOR,
  NG_SUBSCRIBE_MISSING_STREAM_BEHAVIOR,
} from '../tokens';
import { HashMap } from '../types';

/**
 * The object available in the the *ngSubscribe directive's template.
 */
export class NgSubscribeContext<V extends unknown | Array<unknown>> {
  /**
   * The implicitly bindable property of the context object.
   */
  public $implicit?: V;

  /**
   * The name-sake property of the context object.
   */
  public ngSubscribe?: V;

  /**
   * The error received from the bound Observable or Promise
   */
  public error?: Error | string;

  /**
   * Is the bound Observable closed or Promise resolved
   */
  public completed = false;
}

/**
 * Az NgSubscribe direktíva által használt error template kontextus objektuma.
 * Ez az objektum tartja számon a a direktíva inputjában történt hibát
 */
export class NgSubscribeErrorContext {
  /**
   * The implicitly bindable property of the context object.
   */
  public $implicit?: Error;
}

/**
 * @internal
 */
type CombineWith = 'combineLatest' | 'forkJoin' | 'zip';

/**
 * @internal
 */
type StreamCombinerFn = <T>(
  input: Array<RxJsObservableInput<T>>
) => Observable<T>;

/**
 * @internal
 */
const combinerMap: HashMap<
  CombineWith,
  <T>(input: Array<AsyncInput<T>>) => Observable<T>
> = {
  combineLatest,
  forkJoin,
  zip,
};

/**
 * The types of async values bindable to the NGSubscribe directive.
 */
export type AsyncInput<T> = PromiseLike<T> | Subscribable<T>;

/**
 * Egy aszinkron értékeket tartalmazó objektum alakját leíró típus
 */
export type AsyncValuesMap<T> = {
  [K in keyof T]: AsyncInput<T[K]>;
};

/**
 * @internal
 */
type NgSubscribeAsyncInput<T> = AsyncInput<T> | AsyncValuesMap<T>;

/**
* A structural directive that allows the definition of template variables from async sources with ease. This directive does essentially the same as \*ngLet="use$ | async as user" without having to use the `async` pipe explicitly.

* ```html
* <!-- Simple case -->
* <div *ngSubscribe="subscriptionInfo.paymentDueAt$ as paymentDueAt">...</div>
*
* <!-- Object notation syntax -->
* <div
*  \*ngSubscribe="{
*    userData: userData$,
*    paymentDueAt: subscriptionInfo.paymentDueAt$
*  } as userAndSubscriptionData">
*   <p>{{ userAndSubscriptionData.userData.name }}</p>
*   <p>{{ userAndSubscriptionData.paymentDueAt | date }}</p>
* </div>
*
* <!-- Array notation syntax -->
* <div
*  \*ngSubscribe="[
*    userData$,
*    subscriptionInfo.paymentDueAt$
*  ] as userAndSubscriptionData">
*   <p>{{ userAndSubscriptionData[0].name }}</p>
*   <p>{{ userAndSubscriptionData[1] | date }}</p>
* </div>
* ```
*
* The directive utilizes the Angular language service's capabilities and gives you full type checking in it's template.
*/
@Directive({
  selector: '[ngSubscribe]',
})
export class NgSubscribeDirective<T> implements OnInit, OnDestroy {
  /**
   * @ignore
   */
  public static ngTemplateGuard_ngSubscribe: 'binding';

  /**
   * Specify the change detection strategy used by the directive when a new async emission happens.
   * Available options are the methods of the `ChangeDetectorRef` responsible for facilitating change detection.
   * Defaults to `markForCheck`
   */
  @Input('ngSubscribeWithStrategy')
  public strategy: 'markForCheck' | 'detectChanges' = 'markForCheck';

  /**
   * Specify the observable combination strategy used by the directive.
   * Under the hood the directive converts all async values to observables so the strategy applies to all inputs supplied to the directive regardless of the input format used.
   * Available options are RXJS's `combineLatest`, `forkJoin`, `zip` or a custom function that takes an array of observable inputs and returns a single observable stream.
   * Defaults to `combineLatest`
   */
  @Input('ngSubscribeCombineWith')
  public combineWith: CombineWith | StreamCombinerFn = 'combineLatest';

  @Input()
  public set ngSubscribe(input: NgSubscribeAsyncInput<T>) {
    if (this._observable === input) {
      return;
    }

    if (!input) {
      this._observable = this.getMissingStreamBehavior as Observable<T>;
    }

    this.showBefore();

    const source$ =
      Array.isArray(input) || this.isObservableMap(input)
        ? this.handleStreamMerge(input)
        : observify(input);
    this._observable = this._init.pipe(concatMapTo(source$));
    this._subscription && this._subscription.unsubscribe();
    this._subscription = this.subscribeToObservable(this._observable);
  }

  @Input('ngSubscribeError')
  public set errorTpl(ref: TemplateRef<NgSubscribeErrorContext>) {
    this._errorRef = ref;
  }

  @Input('ngSubscribeBefore')
  public set beforeTpl(ref: TemplateRef<null>) {
    this._beforeRef = ref;
  }

  @Input('ngSubscribeAfter')
  public set afterTpl(ref: TemplateRef<null>) {
    this._afterRef = ref;
  }

  @Input('ngSubscribeExceptionBehavior')
  public set customExceptionBehavior(behavior: NgSubscribeBehavior) {
    this._customExceptionBehavior = behavior;
  }

  @Input('ngSubscribeMissingStreamBehavior')
  public set customMissingStreamBehavior(behavior: NgSubscribeBehavior) {
    this._customMissingStreamBehavior =
      typeof behavior === 'function' ? behavior() : behavior;
  }

  private _observable!: Observable<T>;

  private _context = new NgSubscribeContext<T>();

  private _errorContext = new NgSubscribeErrorContext();

  private _subscription!: Subscription;

  private _errorRef!: TemplateRef<NgSubscribeErrorContext>;

  private _customExceptionBehavior!: NgSubscribeBehavior;

  private _customMissingStreamBehavior!: Observable<unknown>;

  private _beforeRef!: TemplateRef<unknown>;

  private _afterRef!: TemplateRef<unknown>;

  private get getMissingStreamBehavior(): Observable<unknown> {
    return (
      this._customMissingStreamBehavior ??
      (typeof this.missingStreamBehavior === 'function'
        ? this.missingStreamBehavior()
        : this.missingStreamBehavior)
    );
  }

  private readonly _init = new AsyncSubject<void>();

  constructor(
    private readonly vcr: ViewContainerRef,
    private readonly cdr: ChangeDetectorRef,
    private readonly tpl: TemplateRef<NgSubscribeContext<T>>,
    @Inject(NG_SUBSCRIBE_MISSING_STREAM_BEHAVIOR)
    private readonly missingStreamBehavior: NgSubscribeBehavior,
    @Inject(NG_SUBSCRIBE_EXCEPTION_BEHAVIOR)
    private readonly exceptionBehavior: NgSubscribeBehavior
  ) {}

  /**
   * @ignore
   */
  public static ngTemplateContextGuard<T>(
    _dir: NgSubscribeDirective<T>,
    ctx: unknown
  ): ctx is NgSubscribeContext<T> {
    return true;
  }

  /**
   * @ignore
   */
  public ngOnInit(): void {
    this.showBefore();
    this._init.next();
    this._init.complete();
    this.vcr.createEmbeddedView(this.tpl, this._context);
  }

  /**
   * @ignore
   */
  public ngOnDestroy(): void {
    this._subscription && this._subscription.unsubscribe();
  }

  private handleStreamMerge(
    input: AsyncValuesMap<T> | Array<PromiseLike<T>> | Array<Subscribable<T>>
  ): Observable<T> {
    const mergedObservables = this.mergeObservables(input);

    const combiner =
      typeof this.combineWith === 'function'
        ? this.combineWith
        : combinerMap[this.combineWith];

    let combinedStreams: Observable<T>;
    try {
      combinedStreams = combiner(Object.values(mergedObservables));
    } catch (error) {
      const exceptionBehavior =
        this._customExceptionBehavior ?? this.exceptionBehavior;
      const replacementStream = (
        typeof exceptionBehavior === 'function'
          ? exceptionBehavior(error)
          : exceptionBehavior
      ) as Observable<T>;

      return (
        isObservable(replacementStream)
          ? replacementStream
          : this.getMissingStreamBehavior
      ) as Observable<T>;
    }

    return combinedStreams.pipe(
      map((merged) => {
        if (Array.isArray(input)) {
          return merged;
        } else {
          const observableMapKeys = Object.keys(input);

          return Object.values(merged as unknown as object).reduce(
            (acc, curr, index) => ({
              ...acc,
              [observableMapKeys[index]]: curr,
            }),
            {}
          ) as T;
        }
      })
    );
  }

  private subscribeToObservable(input: Observable<T>): Subscription {
    return input.subscribe({
      next: (value) => {
        this._context.$implicit = value;
        this._context.ngSubscribe = value;
        this.cdr[this.strategy]();
      },
      error: (err: Error) => {
        if (this._errorRef instanceof TemplateRef) {
          this._errorContext.$implicit = err;
          this.vcr.clear();
          this.vcr.createEmbeddedView(this._errorRef, this._errorContext);
        } else {
          this._context.error = err;
        }

        this.cdr[this.strategy]();
      },
      complete: () => {
        this._context.completed = true;
        if (this._afterRef instanceof TemplateRef) {
          this.vcr.clear();
          this.vcr.createEmbeddedView(this._afterRef, this._context);
        }
        this.cdr[this.strategy]();
      },
    });
  }

  private mergeObservables(
    input: AsyncValuesMap<T> | Array<AsyncInput<T>>
  ): AsyncValuesMap<T> {
    return Array.isArray(input)
      ? input.reduce(
          (acc, curr, index) => ({ ...acc, [index]: curr }),
          {} as AsyncValuesMap<T>
        )
      : input;
  }

  private isObservableMap(
    input: NgSubscribeAsyncInput<T>
  ): input is AsyncValuesMap<T> {
    return Object.values(input).every((val) => isObservable(val));
  }

  private showBefore(): void {
    if (this._beforeRef instanceof TemplateRef) {
      this.vcr.clear();
      this.vcr.createEmbeddedView(this._beforeRef);
    }
  }
}

// function isNgSubscribeContextGuard(value: unknown): value is NgSubscribeContext<any> {
//     return typeof value === 'object' && 'ngSubscribe' in value && '$implicit' in value;
// }

// export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
//     k: infer I
// ) => void
//     ? I
//     : never;

// type LastOf<T> = UnionToIntersection<T extends any ? () => T : never> extends () => infer R
//     ? R
//     : never;

// TS4.0+
// export type Push<T extends Array<any>, V> = [...T, V];

// TS4.1+
// type TuplifyUnion<T, L = LastOf<T>, N = [T] extends [never] ? true : false> = true extends N
//     ? []
//     : Push<TuplifyUnion<Exclude<T, L>>, L>;

// type UnBoxObservableInput<T> = T extends ObservableInput<infer Unboxed>
//     ? UnBoxObservableInput<Unboxed>
//     : T;

// export type UnBoxNgSubscribeObservableInput<T> = T extends ObservableInput<infer Simple>
//     ? Simple
//     : T extends Array<infer Arr>
//     ? Arr
//     : T extends ObservableMap<infer Map>
//     ? Map
//     : never;

// type testInputSimple = UnBoxNgSubscribeObservableInput<Observable<string>>;
// type testInputSimplePro = UnBoxNgSubscribeObservableInput<Promise<string>>;
// type testInputArr = UnBoxNgSubscribeObservableInput<[Observable<string>, Promise<number>]>;
// type testInputMap = UnBoxNgSubscribeObservableInput<{
//     asd: Observable<string>;
//     dsa: Promise<number>;
// }>;
