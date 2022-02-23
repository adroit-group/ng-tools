import { ModuleLoadError } from './module-load-error';

/**
 * Extend this class by an NgModule to make the module singleton,
 * Causing it to throw a `ModuleLoadError` when loaded more than once.
 * The derived class must use the `Optional` and `SkipSelf` decorators
 * on it's constructor's first parameter that must be named `self`
 * and must have the type annotation of the derived class. see the example below
 *
 * @example
 * ```ts
 *  \@NgModule({
 *      ...
 *  })
 *  export class CoreModule extends SingletonModule {
 *      constructor(\@Optional() \@SkipSelf() protected self: CoreModule) {
 *          super(self);
 *      }
 *  }
 * ```
 */
export abstract class ASingletonModule {
  /**
   * @param self The same module class instance received from the DI system.
   */
  constructor(self?: ASingletonModule) {
    if (self) {
      // eslint-disable-next-line @typescript-eslint/ban-types
      throw new ModuleLoadError((self as unknown as Function).name);
    }
  }
}
