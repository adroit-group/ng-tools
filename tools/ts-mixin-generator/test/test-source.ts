import { Component } from '@angular/core';

class A {
  public static staticAProp: string;

  public instancePropOfA = 10;

  public methodOfA(): void {}
}

@Component({
  selector: 'adroit-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent extends A {
  title = 'ng-util-demo';

  /**
   * @summary Test docs
   */
  public noop(): void {
    console.log('no op handler called!', this);
  }
}
