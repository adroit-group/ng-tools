import { NgModule } from '@angular/core';
import { SafePipe } from './safe.pipe';

@NgModule({
  imports: [SafePipe],
  providers: [SafePipe],
  exports: [SafePipe],
})
export class SafeModule {}
