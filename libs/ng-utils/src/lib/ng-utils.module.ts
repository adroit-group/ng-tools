import { PlatformObserver } from './services/platform-observer.service';
import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { LIB_DIRECTIVES } from './directives';
import { LIB_PIPES } from './pipes';
import { MixinDependencyResolverModule } from './mixin-dependency-resolver.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { LayoutModule } from '@angular/cdk/layout';

@NgModule({
  imports: [
    CommonModule,
    MixinDependencyResolverModule,
    FlexLayoutModule,
    LayoutModule,
  ],
  declarations: [...LIB_DIRECTIVES, ...LIB_PIPES],
  exports: [...LIB_DIRECTIVES, ...LIB_PIPES, FlexLayoutModule, LayoutModule],
})
export class AdroitNgUtilsModule {
  public static platformObserver: PlatformObserver;

  public static forRoot(): ModuleWithProviders<AdroitNgUtilsModule> {
    return {
      ngModule: AdroitNgUtilsModule,
      providers: [...LIB_PIPES],
    };
  }

  constructor(platformObserver: PlatformObserver) {
    AdroitNgUtilsModule.platformObserver = platformObserver;
  }
}
