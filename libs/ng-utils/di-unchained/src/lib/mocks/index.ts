/* eslint-disable @angular-eslint/component-selector */
import {
  ApplicationRef,
  Component,
  inject,
  Injectable,
  OnInit,
} from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { DIContextProvider, Unchained } from '../decorators';
import { NgModule } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TestService {
  public name = 'TestService';
}

@Unchained()
export class TestClass {
  router: Router;

  static routerFn = () => inject(Router);

  static getRouter() {
    return inject(Router);
  }

  routerFn = () => inject(Router);

  constructor() {
    this.router = inject(Router);
  }

  getTitleService() {
    const title = inject(Title);

    console.log('title: ', title);
  }

  public get neta() {
    return inject(Meta);
  }

  public static get appRef() {
    return inject(ApplicationRef);
  }
}

@Unchained()
export class TestChildClass extends TestClass {
  featureName = inject(TestService).name;
}

class OtherTestClass {
  @Unchained()
  getTitleService() {
    return inject(Title);
  }

  @Unchained()
  get Meta() {
    return inject(Meta);
  }
}

@Component({
  selector: 'app-test',
  template: '',
})
export class TestComponent implements OnInit {
  title = 'DI-unchained';

  myInstance!: TestClass;

  otherInstance!: OtherTestClass;

  childInstance!: TestChildClass;

  ngOnInit(): void {
    this.myInstance = new TestClass();
    this.otherInstance = new OtherTestClass();
    this.childInstance = new TestChildClass();
  }
}

@NgModule({
  declarations: [TestComponent],
})
@DIContextProvider()
export class TestModule {}
