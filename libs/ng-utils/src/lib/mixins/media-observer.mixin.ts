import { MediaObserver as FlexMediaObserver } from '@angular/flex-layout';
import { Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { Constructor } from '../interfaces';
import { MixinDependencyResolverModule } from '../mixin-dependency-resolver.module';
import { MixinType } from '../types';

/**
 * A MediaObserverMixin által szolgáltatott publikus osztyál elemeket leíró interface
 * Az alábbi property-k nem a tényleges futtató platform típusát határozzák meg, hanem a böngészőben elérhető képernyő méret típusát.
 */
interface IMediaObserver {
  /**
   * Az alkalmazás mobilos nézetű böngészőben van-e használva.
   */
  readonly xs$: Observable<boolean>;

  readonly sm$: Observable<boolean>;

  readonly md$: Observable<boolean>;

  readonly lg$: Observable<boolean>;

  readonly xl$: Observable<boolean>;

  /**
   * Az alkalmazás tabletes vagy mobilos nézetű böngészőben van-e használva.
   */
  readonly ltMd$: Observable<boolean>;
  /**
   * Az alkalmazás asztali monitor nézetű böngészőben van-e használva.
   */
  readonly gtMd$: Observable<boolean>;

  readonly observer: FlexMediaObserver;
}

/**
 * A Mixin function that provides functionality related to handling subscriptions.
 * Class extending this mixin will have access to the 'onDestroy' property that should be used in the various takeUntil operators throughout the streams defined by the concrete class.
 * The mixin's subscription handling logic depends on it's 'ngOnDestroy' method being called by Angular. If you have to define 'onDestroy' in your concrete class make sure to call super.ngOnDestroy as well!
 *
 * @example
 * ```ts
 * class MyComp extends SubscriptionHandlerMixin() {
 *      constructor() {
 *           super();
 *       }
 *  }
 * ```
 */
export function MediaObserverMixin<
  T extends Constructor<any, Array<any>> = FunctionConstructor
>(base?: T): MixinType<T, IMediaObserver> {
  const Base = (base ?? class {}) as Constructor<any, Array<any>>;

  return class MediaObserver extends Base implements IMediaObserver {
    public readonly observer =
      MixinDependencyResolverModule.injector.get(FlexMediaObserver);

    public readonly xs$ = this.isBreakPointActive('xs');
    public readonly sm$ = this.isBreakPointActive('sm');
    public readonly md$ = this.isBreakPointActive('md');
    public readonly lg$ = this.isBreakPointActive('lg');
    public readonly xl$ = this.isBreakPointActive('xl');
    public readonly ltMd$ = this.isBreakPointActive(['xs', 'sm']);
    public readonly gtMd$ = this.isBreakPointActive(['lg', 'xl']);

    protected isBreakPointActive(
      breakPoint: string | Array<string>
    ): Observable<boolean> {
      return this.observer.media$.pipe(
        map((media) =>
          Array.isArray(breakPoint)
            ? breakPoint.includes(media.mqAlias)
            : media.mqAlias === breakPoint
        ),
        distinctUntilChanged()
      );
    }
  } as any;
}
