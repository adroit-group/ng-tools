import { AdroitNgUtilsModule } from '@adroit-group/ng-utils';
import { NgModule, Injector } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AdroitNgUtilsModule.forRoot()],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(injector: Injector) {
    (window as any)['AppModuleInjector'] = injector;
  }
}
