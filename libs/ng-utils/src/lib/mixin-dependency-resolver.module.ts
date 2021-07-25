import { Injector, NgModule, Optional, SkipSelf } from '@angular/core';
import { ASingletonModule } from '~classes';

const injectorSym = Symbol('__MixinDependencyResolverModule:InjectorSym__');

/**
 * An eagerly loaded and globally available NgModule that's purpose is to act as a mediator between mixin classes and the Angular DI system.
 * If a mixin class requires dependencies from the Angular Di system it can request it through this Module class using
 * it's static property injector, which is an instance of the app's root injector.
 * If a mixin requires context or template specific dependencies than this module isn't a valid solution as it's injector
 * is the global injector and thus has no notion of the context and template specific dependencies.
 *
 * @example
 */
@NgModule({})
export class MixinDependencyResolverModule extends ASingletonModule {
  /**
   * Az Angular DI rendszer által biztotított injektor
   */
  public static get injector(): Injector {
    return MixinDependencyResolverModule[injectorSym];
  }

  private static [injectorSym]: Injector;

  /**
   * konstruktor
   *
   * @param self A MixinDependencyResolverModule már korábban létrehozott példánya (ha van)
   * @param injector Az Angular DI rendszer által biztotított injektor
   */
  constructor(
    @Optional() @SkipSelf() protected self: MixinDependencyResolverModule,
    injector: Injector
  ) {
    super(self);
    MixinDependencyResolverModule[injectorSym] = injector;
  }
}
