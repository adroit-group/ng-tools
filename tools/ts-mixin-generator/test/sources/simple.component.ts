import { Component } from '@angular/core';

@Component({
  selector: 'adroit-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'ng-util-demo';

  /**
   * @summary Test docs
   */
  public noop(): void {
    console.log('no op handler called!', this);
  }
}
