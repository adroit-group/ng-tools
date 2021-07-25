import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { LIB_SERVICES } from 'services';
import { LIB_DIRECTIVES } from '~directives';
import { LIB_PIPES } from '~pipes';

@NgModule({
  imports: [CommonModule],
  declarations: [...LIB_DIRECTIVES, ...LIB_PIPES],
  exports: [...LIB_DIRECTIVES, ...LIB_PIPES],
})
export class AdroitNgUtilsModule {
  public static forRoot(): ModuleWithProviders<AdroitNgUtilsModule> {
    return {
      ngModule: AdroitNgUtilsModule,
      providers: [...LIB_SERVICES, ...LIB_PIPES],
    };
  }
}
