import { Subject } from 'rxjs';
import { Constructor } from '~interfaces';
import { MixinType } from '~types';

/**
 * A SubscriptionHandlerMixin által szolgáltatott publikus osztyál elemeket leíró interface
 */
interface ISubscriptionHandler {
  /**
   * A streamek gyüjtő subscription-ja.
   * Erről fog a Mixin-el ellátott osztály automatikus leiratkozni az ngOnDestroy hook-ban.
   */
  readonly onDestroy$: Subject<void>;
  /**
   * A direktíva/komponens destrukciós logikáját tartalmazó Angular life cycle hook
   */
  ngOnDestroy(): void;
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
export function SubscriptionHandlerMixin<
  T extends Constructor<any, Array<any>> = FunctionConstructor
>(base?: T): MixinType<T, ISubscriptionHandler> {
  const Base = (base ?? class {}) as Constructor<any, Array<any>>;

  return class SubscriptionHandler
    extends Base
    implements ISubscriptionHandler
  {
    public readonly onDestroy$ = new Subject<void>();

    /**
     * a helyi onDestroy$ subjectet zárja le egy emit után.
     * A komponens belső stream-jeit zárjuk le általában erre a subjectre figyelve, így a streamek lezáródnak, amikor a komponens életciklusa véget ér
     */
    public ngOnDestroy(): void {
      this.onDestroy$.next();
      this.onDestroy$.complete();
    }
  } as any;
}
