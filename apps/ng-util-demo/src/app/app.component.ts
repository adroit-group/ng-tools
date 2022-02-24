import {
  AutoHooks,
  MediaObserverMixin,
  SubscriptionHandlerMixin,
  TrackByHandlerMixin,
} from '@adroit-group/ng-utils';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'adroit-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
@AutoHooks()
export class AppComponent
  extends TrackByHandlerMixin(MediaObserverMixin(SubscriptionHandlerMixin()))
  implements OnInit
{
  title = 'ng-util-demo';

  public noop(): void {
    console.log('no op handler called!', this);
  }

  public ngOnInit(): void {
    console.log('AppComp on init: ', this);
  }
}
