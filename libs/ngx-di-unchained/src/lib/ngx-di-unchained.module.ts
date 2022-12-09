import { ModuleWithProviders, NgModule } from '@angular/core';
import { EXPOSE_ENV_INJECTOR_INITIALIZER } from './decorators';


/**
 * Import this module and use it's .forRoot() function in your root module
 * to configure the Angular DI system to work with the @Unchained() decorators.
 *
 * @example ```ts
 * \@NgModule({
 *    imports: [NgxDiUnchainedModule.forRoot()]
 * })
 * export class AppModule {}
 * ```
 */
@NgModule()
export class NgxDiUnchainedModule {
  static forRoot(): ModuleWithProviders<NgxDiUnchainedModule> {
    return {
      ngModule: NgxDiUnchainedModule,
      providers: [EXPOSE_ENV_INJECTOR_INITIALIZER],
    };
  }
}
