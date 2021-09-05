import { SubscriptionHandlerMixin } from '@adroit/ng-utils';
import { Component } from '@angular/core';

@Component({
  selector: 'adroit-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent extends SubscriptionHandlerMixin() {
  title = 'ng-util-demo';

  public noop(): void {
    console.log('no op handler called!', this);
  }
}
