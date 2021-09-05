/* eslint-disable max-classes-per-file */
import { Constructor } from '../interfaces';
import { MixinType } from '../types';

/**
 * A TrackByHandlerMixin által szolgáltatott publikus osztyál elemeket leíró interface
 */
export interface ITrackByHandler {
  /**
   * Entitás lista elemeinek nyilvántartásához hasznmált identitás függvény
   *
   * @param index Az entitás indexe a lsitában
   * @param item Az entitás objektum
   */
  trackBy(index: number, item: any): string;
}

/**
 * A Mixin function that provides functionality related to handling track-by functions for ngFor directives used in the component's template.
 * Class extending this mixin will a trackById function that can be referenced in the component's template for ngFor directives' 'trackBy' inputs.
 *
 * @example
 * ```ts
 * class MyComp extends TrackByHandlerMixin() {
 *      constructor() {
 *           super();
 *       }
 *  }
 * ```
 */
export function TrackByHandlerMixin<
  T extends Constructor<any, Array<any>> = FunctionConstructor
>(
  base?: T,
  trackByKeyOrPropFn?: string | ((item: any) => string)
): MixinType<T, ITrackByHandler> {
  const Base = (base ?? class {}) as Constructor<any, Array<any>>;

  return class extends Base implements ITrackByHandler {
    public trackBy(index: number, item: any): string {
      let trackBy =
        typeof trackByKeyOrPropFn === 'function'
          ? trackByKeyOrPropFn(item)
          : trackByKeyOrPropFn;

      if (!trackBy) {
        trackBy = 'id';
      }

      return typeof item === 'object'
        ? item[trackBy]
        : (item as any).toString() ?? index.toString();
    }
  } as any;
}

// class MYComp extends TrackByHandlerMixin() {
//     constructor() {
//         super();
//     }
// }

// class MYComp extends TrackByHandlerMixin(SubscriptionHandlerMixin(MediaObserverMixin()), 'name') {
//     constructor(MediaObserver: MediaObserver) {
//         super(MediaObserver);

//     }
// }
