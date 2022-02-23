/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injector, InjectFlags, ProviderToken } from '@angular/core';
import { MixinDependencyResolverModule } from '../mixin-dependency-resolver.module';

/**
 * @internal
 */
interface IMixinDependencyResolverConfig {
  injector?: Injector;
  notFoundValue?: any;
  flags?: InjectFlags;
}

export function resolveMixinDependency<T>(
  dep: ProviderToken<T>,
  config: IMixinDependencyResolverConfig = {
    injector: MixinDependencyResolverModule.injector,
    flags: undefined,
    notFoundValue: undefined,
  }
): T {
  const { injector, flags, notFoundValue } = config;

  if (typeof injector !== 'object' || typeof injector.get !== 'function') {
    const depName =
      typeof dep === 'function' ? dep.name : dep?.toString() ?? dep;
    throw new Error(`
      Could not resolve dependency: ${depName} for mixin.
      Either import AdroitNgUtilsModule into your application
      or supply a valid child injector in the configuration of ${resolveMixinDependency.name}.
    `);
  }

  return injector.get(dep, notFoundValue, flags);
}
