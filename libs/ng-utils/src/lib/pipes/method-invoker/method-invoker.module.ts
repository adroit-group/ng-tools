import { NgModule } from '@angular/core';
import { MethodInvokerPipe } from './method-invoker.pipe';

@NgModule({
  imports: [MethodInvokerPipe],
  providers: [MethodInvokerPipe],
  exports: [MethodInvokerPipe],
})
export class MethodInvokerModule {}
