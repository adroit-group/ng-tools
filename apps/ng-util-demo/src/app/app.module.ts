import { AdroitNgUtilsModule } from '@adroit/ng-utils';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AdroitNgUtilsModule.forRoot()],
  bootstrap: [AppComponent],
})
export class AppModule {}
