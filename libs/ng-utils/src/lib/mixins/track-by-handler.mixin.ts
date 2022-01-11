import { Constructor } from '../interfaces';
import { mixinBase } from '../utils/mixin-base';
import { MixinType } from '../types';

/**
 * A Mixin function that provides functionality related to handling track-by functions for ngFor directives used in the component's template.
 * A class extending this mixin will have access to a general purpose `trackBy` function that can be referenced in the component's template for ngFor directives' `trackBy` inputs.
 * The `trackBy` function will try to use the received objects' ids as unique keys, however this behavior can be configured in the mixin's second parameter.
 *
 * @example
 * ```ts
 * class MyComp extends TrackByHandlerMixin() {
 *    constructor() {
 *      super();
 *    }
 * }
 *```
 *
 *```html
 *  <div *ngFor="pics of pictures; trackBy: trackBy">...</div>
 *```
 **/
export function TrackByHandlerMixin<T extends Constructor<any, unknown[]>>(
  base?: T,
  trackByKeyOrPropFn?: string | ((item: any) => string)
) {
  const TrackByHandler = class extends mixinBase(base) {
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
  };

  return TrackByHandler as MixinType<typeof TrackByHandler, T>;
}
