import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LIB_DIRECTIVES } from './directives';
import { MixinDependencyResolverModule } from './mixin-dependency-resolver.module';
import { LIB_PIPES } from './pipes';
import { AdroitNgUtilsCoreModule } from './ng-utils-core.module';

@NgModule({
  imports: [
    CommonModule,
    AdroitNgUtilsCoreModule,
    MixinDependencyResolverModule,
    ...LIB_DIRECTIVES,
    ...LIB_PIPES,
  ],
  exports: [...LIB_DIRECTIVES, ...LIB_PIPES],
})
export class AdroitNgUtilsModule {
  static forRoot() {
    return {
      ngModule: AdroitNgUtilsModule,
    };
  }
}
