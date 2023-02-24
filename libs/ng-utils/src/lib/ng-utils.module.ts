import { LayoutModule } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { LIB_DIRECTIVES } from './directives';
import { MixinDependencyResolverModule } from './mixin-dependency-resolver.module';
import { LIB_PIPES } from './pipes';
import { PlatformObserverService } from './services/platform-observer.service';

@NgModule({
  imports: [CommonModule, MixinDependencyResolverModule, LayoutModule],
  declarations: [...LIB_DIRECTIVES, ...LIB_PIPES],
  exports: [...LIB_DIRECTIVES, ...LIB_PIPES, LayoutModule],
})
export class AdroitNgUtilsModule {
  public static platformObserver: PlatformObserverService;

  public static forRoot(): ModuleWithProviders<AdroitNgUtilsModule> {
    return {
      ngModule: AdroitNgUtilsModule,
      providers: [...LIB_PIPES],
    };
  }

  constructor(platformObserver: PlatformObserverService) {
    AdroitNgUtilsModule.platformObserver = platformObserver;
  }
}
