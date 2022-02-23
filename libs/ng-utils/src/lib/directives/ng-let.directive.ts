/* eslint-disable @angular-eslint/directive-selector */
/* eslint-disable max-classes-per-file */
import {
  ChangeDetectorRef,
  Directive,
  Input,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';

/**
 * The object available in the the *ngLet directive's template.
 */
export class NgLetContext<T> {
  /**
   * The implicitly bindable property of the context object.
   */
  public $implicit?: T;
  /**
   * The name-sake property of the context object.
   */
  public ngLet?: T;
}

/**
 * A structural directive that allows the definition of template variables with ease.
 *
 * @example ```html
 * <!-- Simple case -->
 *  <div *ngLet="user.profileInfo.subscriptionInfo as userSubInfo"> ... </div>
 * <!-- With pipes -->
 *  <div *ngLet="userData$ | async as userData"> ... </div>
 * <!-- Object notation syntax -->
 * <div *ngLet="{ userData: userData$ | async, cartPrice: cartData.totalPrice} as userAndCartData">
 *    <p> {{ userAndCartData.userData.name }} </p>
 *    <p> {{ userAndCartData.cartPrice | currency }} </p>
 * </div>
 * <!-- Array notation syntax -->
 * <div *ngLet="[userData$ | async, cartData.totalPrice] as userAndCartData">
 *    <p> {{ userAndCartData[0].name }} </p>
 *    <p> {{ userAndCartData[1] | currency }} </p>
 * </div>
 * ```
 */
@Directive({
  selector: '[ngLet]',
})
export class NgLetDirective<T> implements OnInit {
  /**
   * @internal
   */
  #memoizedValue: unknown;

  private context = new NgLetContext<T>();

  /**
   * The value(s) that will be made available inside the *ngLet template.
   */
  @Input()
  public set ngLet(input: T) {
    if (input === this.#memoizedValue) {
      return;
    }
    this.#memoizedValue = input;
    this.context.ngLet = input;
    this.cdr.markForCheck();
  }

  constructor(
    private readonly vcr: ViewContainerRef,
    private readonly cdr: ChangeDetectorRef,
    private readonly templateRef: TemplateRef<NgLetContext<T>>
  ) {}

  /**
   * @ignore
   */
  public static ngTemplateContextGuard<T>(
    _dir: NgLetDirective<T>,
    ctx: unknown
  ): ctx is NgLetContext<T> {
    return true;
  }

  /**
   * @ignore
   */
  public ngOnInit(): void {
    this.vcr.createEmbeddedView(this.templateRef, this.context);
  }
}
