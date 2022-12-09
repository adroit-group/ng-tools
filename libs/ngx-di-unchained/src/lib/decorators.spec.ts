import { ApplicationRef, inject } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Title, Meta, BrowserModule } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Unchained } from './decorators';


@Unchained()
class MyClass {
  router: Router;

  routerFn = () => inject(Router);

  static routerFn = () => inject(Router);

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

  static getRouter() {
    return inject(Router);
  }
}

@Unchained()
class MyChildClass extends MyClass {
  featureName = inject(FeatureAService).name;
}

class MyOtherClass {
  @Unchained()
  getTitleService() {
    return inject(Title);
  }

  @Unchained()
  get Meta() {
    return inject(Meta);
  }
}

describe('DI Unchained', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrowserModule, RouterTestingModule],
      declarations: [AppComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(AppComponent);
  });

  it(`Decorated class should be able to use DI on static props and methods.`, () => {
    expect(MyClass.appRef).toBeInstanceOf(ApplicationRef);
    expect(MyClass.getRouter()).toBeInstanceOf(Router);
    expect(MyClass.routerFn()).toBeInstanceOf(Router);
  });

  it(`Decorated class should be able to create.`, () => {
    const myInstance = new MyClass();

    expect(myInstance).toBeDefined();
    expect(myInstance).toBeInstanceOf(MyClass);
  });

  it(`Decorated class should have it's instance members initialized.`, () => {
    const myInstance = new MyClass();

    expect(myInstance.router).toBeDefined();
    expect(myInstance.router).toBeInstanceOf(Router);
  });

  it(`Decorated class should have it's prototype members .`, () => {
    const myInstance = new MyClass();

    expect(myInstance.router).toBeDefined();
    expect(myInstance.router).toBeInstanceOf(Router);
  });
});
