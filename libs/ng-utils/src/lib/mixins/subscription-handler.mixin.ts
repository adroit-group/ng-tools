/* eslint-disable @typescript-eslint/no-explicit-any */
import { Subject } from 'rxjs';
import { MixinType } from '../types';
import { Constructor } from '../interfaces';
import { mixinBase } from '../utils/mixin-base';

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
export function SubscriptionHandlerMixin<T extends Constructor<any, unknown[]>>(
  base?: T
) {
  const SubscriptionHandler = class extends mixinBase(base) {
    /**
     * The Subscription handler's subject that signals when the component's or directive's onDestroy hook is called to enable automatic unsubscribe logic.
     */
    public readonly _onDestroy$ = new Subject<void>();

    public readonly onDestroy$ = this._onDestroy$.asObservable();

    public ngOnDestroy(): void {
      this._onDestroy$.next();
      this._onDestroy$.complete();
    }
  };

  return SubscriptionHandler as MixinType<typeof SubscriptionHandler, T>;
}
