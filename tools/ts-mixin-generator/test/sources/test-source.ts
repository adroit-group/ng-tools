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

  public explicitPublicPropOfComp = {
    name: 'test',
    id: 1,
  };

  public get publicGetterOfClass() {
    return true;
  }

  private readonly privatePropertyOfComp = true;

  protected protectedPropertyOfComp = 0;

  protected get protectedGetterOfComp() {
    return '';
  }

  /**
   * @summary Test docs
   */
  public publicMethodOfComp(): void {
    console.log('no op handler called!', this);
  }

  private privateMethodOfComp(): void {}

  protected protectedMethodOfCom(): void {}
}
