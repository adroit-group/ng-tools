<p align="center">
 <img width="0" height="0" src="https://adroitgroup.io/wp-content/uploads/2019/02/web_logo.png?sanitize=true">
</p>

[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors)[![spectator](https://img.shields.io/badge/tested%20with-spectator-2196F3.svg?style=flat-square)]()[![MIT](https://img.shields.io/packagist/l/doctrine/orm.svg?style=flat-square)]()[![commitizen](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=flat-square)]()[![PRs](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)]()[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)[![Build Status](https://travis-ci.org/adroit/ng-tools.svg?branch=master)](https://travis-ci.org/adroit/ng-tools)

# NG Utils

Handy utilities for Angular development

All notable changes to this project are documented in [CHANGELOG.md](https://github.com/Adroit-Group/ng-tools/blob/master/CHANGELOG.md) file.

## Versioning

|  Package version |  Angular version |
|------------------|------------------|
| 0.3.x            | 13.x             |
| 14.x             | 14.x             |
| 15.x             | 15.x             |

## Table of contents

- [NG Utils](#ng-utils)
  - [Versioning](#versioning)
  - [Table of contents](#table-of-contents)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Configuration](#configuration)
  - [Decorators](#decorators)
    - [Auto hooks](#auto-hooks)
      - [Quick rundown of usage:](#quick-rundown-of-usage)
      - [Detailed introduction](#detailed-introduction)
    - [RunIn Decorator](#runin-decorator)
      - [RunInBrowser Decorator](#runinbrowser-decorator)
      - [RunInServer Decorator](#runinserver-decorator)
  - [Directives](#directives)
    - [NgLet Directive](#nglet-directive)
    - [NgSubscribe Directive](#ngsubscribe-directive)
    - [NgComponentOutlet Augmentation Directive](#ngcomponentoutlet-augmentation-directive)
    - [NgFor Augmentation Directive](#ngfor-augmentation-directive)
    - [NgIf Augmentation Directive](#ngif-augmentation-directive)
    - [NgRenderIn Directive](#ngrenderin-directive)
      - [NgRenderInBrowser Directive](#ngrenderinbrowser-directive)
      - [NgRenderInServer Directive](#ngrenderinserver-directive)
    - [FormControlName Augmentation Directive](#formcontrolname-augmentation-directive)
  - [Services](#services)
    - [Platform Observer](#platform-observer)
  - [Pipes](#pipes)
    - [Method Invoker](#method-invoker)
  - [Mixins](#mixins)
    - [Subscription Handler](#subscription-handler)
    - [Media Observer](#media-observer)
    - [TrackBy Handler](#trackby-handler)
  - [Development environment](#development-environment)

## Installation

Run `npm install @adroit-group/ng-utils --save` to install the library.

## Usage

Include `AdroitNgUtilsModule` in your module

```typescript
import { AdroitNgUtilsModule } from 'ng-utils';

@NgModule({
  imports: [
    AdroitNgUtilsModule.forRoot(),
  ]
})
```

## Configuration

```typescript
import { AdroitNgUtilsModule } from 'ng-utils';

@NgModule({
  imports: [
    AdroitNgUtilsModule.forRoot({

    }),
  ]
})
```

[⬆ Back to top](#table-of-contents)

## Decorators

### Auto hooks

A decorator which ensures that the lifecycle hooks of components and directives that use mixins are called properly.

#### Quick rundown of usage:

- Only one decorator per prototype chain.
- All Angular lifecycle methods are bound automatically
- You can bind custom methods by supplying their names in the first parameter array of the decorator
- Don't call the super versions of the bound methods yourself
- ngOnChanges doesn't work prior to Angular v10

Basic usage:

```typescript
@Component({
  selector: 'my-comp',
  templateUrl: './my.component.html',
  styleUrls: ['./my.component.scss'],
})
@AutoHooks()
export class MyComp extends SubscriptionHandlerMixin() implements OnInit { ... }
```

Linking custom methods:

```typescript
@Component({
  selector: 'my-comp',
  templateUrl: './my.component.html',
  styleUrls: ['./my.component.scss'],
})
@AutoHooks(['initialize'])
export class MyComp extends SubscriptionHandlerMixin() implements OnInit { ... }
```

#### Detailed introduction

The decorator applies automatic binding for the Angular specific lifecycle hooks.

This ensures that both the components' own methods and any other method on the mixins' prototypes are called in the same order in which constructor calls would do. (Starting with the last mixin class and calling continuosly toward the actual class that extends the mixins)

Nor the classes decorated with AutoHooks decorator neither the mixin or base classes applied to it are allowed to manually call the super version of the methods being bound.

That would result in unintended and multiple invocation of said methods.

The ngOnChanges hook is exempt from automatic invocation binding behavior when the decorator is used with an Angular version less than v10 as binding this lifecycle hooks results in a faulty behavior where the method does not receive the changes parameter object.

If a class's prototype chain contains real classes apart from the applied mixins those classes cannot use AutoHooks in tandem with the child class's decorator.

[⬆ Back to top](#table-of-contents)

### RunIn Decorator

A decorator that restricts the usage of methods and accessors.

Methods and accessors decorated will only ran (when invoked
from the client code), if the application's active platform matches those supplied to the decorator.

This makes it easy to optimize various execution scenarios
and rid the application of execution paths that would cause problems in certain environments.

```ts
import {
  EApplicationPlatform,
  RunIn,
  RunInBrowser,
  RunInServer
} from '@adroit-group/ng-utils';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @RunInBrowser()
  public set setterThatUsesWindow(value: string) { ... }

  @RunInServer()
  public set setterThatSetsMetaTags(value) { ... }

  @RunIn(EApplicationPlatform.Browser)
  public methodThatUsesWindow(value: string) { ... }
}
```

#### RunInBrowser Decorator

An Alias decorator for \@RunIn(EApplicationPlatform.Browser)

```ts
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @RunInBrowser()
  public set setterThatUsesWindow(value: string) { ... }
}
```

#### RunInServer Decorator

An Alias decorator for \@RunIn(EApplicationPlatform.Server)

```ts
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @RunInServer()
  public set setterThatSetsMetaTags(value) { ... }
}
```

[⬆ Back to top](#table-of-contents)

## Directives

### NgLet Directive

A structural directive that allows the definition of template variables with ease.

```html
<!-- Simple case -->
<div *ngLet="user.profileInfo.subscriptionInfo as userSubInfo">...</div>

<!-- With pipes -->
<div *ngLet="userData$ | async as userData">...</div>

<!-- Object notation syntax -->
<div
  *ngLet="{ 
    userData: userData$ | async, 
    cartPrice: cartData.totalPrice
  } as userAndCartData"
>
  <p>{{ userAndCartData.userData.name }}</p>
  <p>{{ userAndCartData.cartPrice | currency }}</p>
</div>

<!-- Array notation syntax -->
<div *ngLet="[userData$ | async, cartData.totalPrice] as userAndCartData">
  <p>{{ userAndCartData[0].name }}</p>
  <p>{{ userAndCartData[1] | currency }}</p>
</div>
```

The directive utilizes the Angular language service's capabilities and gives you full type checking in it's template.

[⬆ Back to top](#table-of-contents)

### NgSubscribe Directive

A structural directive that allows the definition of template variables from async sources with ease. This directive does essentially the same as `*ngLet="use$ | async as user"` without having to use the `async` pipe explicitly.

```html
<!-- Simple case -->
<div *ngSubscribe="subscriptionInfo.paymentDueAt$ as paymentDueAt">...</div>

<!-- Object notation syntax -->
<div
  *ngSubscribe="{ 
    userData: userData$, 
    paymentDueAt: subscriptionInfo.paymentDueAt$
  } as userAndSubscriptionData"
>
  <p>{{ userAndSubscriptionData.userData.name }}</p>
  <p>{{ userAndSubscriptionData.paymentDueAt | date }}</p>
</div>

<!-- Array notation syntax -->
<div
  *ngSubscribe="[
    userData$, 
    subscriptionInfo.paymentDueAt$
  ] as userAndSubscriptionData"
>
  <p>{{ userAndSubscriptionData[0].name }}</p>
  <p>{{ userAndSubscriptionData[1] | date }}</p>
</div>
```

The directive utilizes the Angular language service's capabilities and gives you full type checking in it's template.

[⬆ Back to top](#table-of-contents)

### NgComponentOutlet Augmentation Directive

Augments the {@link NgComponentOutlet} directive to allow for binding of inputs and outputs.

In your lazy loaded component define the input and outputs you wish to bind to.

```ts
@Component({
  selector: 'lazy-loaded-component',
  template: `...`
})
export class LazyLoadedComponent {
  @Input() public input1: string;
 
  @Output() public output1 = new EventEmitter<string>();
}
```

In the template where you wish to use the component, use the directive to bind the inputs and outputs.

```html
<ng-container 
  *ngComponentOutlet="lazyLoadedComp$ | async; inputs: { input1: 'test' }"
></ng-container>
```

If you want to bind to the lazy loaded components outputs' as well, then you have to use the non-micro-syntax version of the directive, as the micro-syntax version does not support binding to outputs.

```html
<ng-container
  [ngComponentOutlet]="lazyLoadedComp$ | async"
  [ngComponentOutletInputs]="{ input1: 'test' }"
  [ngComponentOutletOutputs]="onComponentEvent($event)">
</ng-container>
```

Then in your component, you can handle the event like so:

```ts
export class MyComponentThatUsesLazyLoadedComponent {
  public onComponentEvent(event: NgComponentOutletEvent): void {
    if (event.key === 'output1') {
      // do something with the received event data through event.event
    }
  }
}
```

[⬆ Back to top](#table-of-contents)

### NgFor Augmentation Directive

A utility directive that enhances Angular's `*ngFor` directive with extra functionality.

The directive is implicitly applied every time the original `*ngFor` is used and provides two additional template options for `*ngFor`.

You can supply both a no array and an empty array template to be rendered.

```html
<p *ngFor="let item of items$ | async else loading empty blank">{{item}}</p>
```

credit: Alexander Inkin - https://medium.com/@waterplea

Medium article: https://medium.com/angularwave/non-binary-ngif-cfdf7c474852

[⬆ Back to top](#table-of-contents)

### NgIf Augmentation Directive

A utility directive that enhances Angular's `*ngIf` directive with extra functionality.

The directive is implicitly applied every time the original `*ngIf` is used and provides two additional template options for `*ngIf`.

You can supply both a loading and error template for `*ngIf`.
This can be particularly useful when you are working with async data

```html
<p *ngIf="value$ | async as value else default or loading but error">
  {{value}}
</p>
```

credit: Alexander Inkin - https://medium.com/@waterplea
Medium article: https://medium.com/angularwave/non-binary-ngif-cfdf7c474852

[⬆ Back to top](#table-of-contents)

### NgRenderIn Directive

A structural directive that allows the rendering on templates based on the platform the application is running on.

The typical use case of the directive is to enable the usage of different templates for different rendering modes, eg.: usae a different view when the application is ran in SSR.

```html
<app-splash-screen *appRenderIn="'browser'"></app-splash-screen>
```

There are two utility versions of this directive
NgRenderInBrowser (*ngRenderInBrowser) and NgRenderInServer (*ngRenderServer) that do exactly what their names suggest.

#### NgRenderInBrowser Directive

A structural directive that only renders it's template if the application is ran in the browser.

```html
<app-splash-screen *ngRenderInBrowser></app-splash-screen>
```

#### NgRenderInServer Directive

A structural directive that only renders it's template if the application is ran in the server environment (SSR).

```html
<app-splash-screen *ngRenderInServer></app-splash-screen>
```

[⬆ Back to top](#table-of-contents)

### FormControlName Augmentation Directive

A utility directive that exposes the `FormControlName` with `exportAs` so it can be stored in a template variable.

```html
<input formControlName="testControl" #templateVariableName="formControlName" />
<span *ngIf="templateVariableName.invalid">Error message</span>
```

[⬆ Back to top](#table-of-contents)

## Services

### Platform Observer

An Injectable service that helps to identify the platform where the application runs.

## Pipes

### Method Invoker

A meta pipe that aims to replace most or all other pipes in your application.
This pipe take a function and optionally it's arguments as parameter(s) an executes it.
A context object can be supply to the pipe through Angular's DI system
in turn enabling the usage and reference of the this parameter of the component or directive that defined the function.

Without context

```html
<p>{{ getRelativeDateTime | invoke: orderDate }}</p>
```

With context

```ts
@component({
  ...
  providers: [
    {
      provide: METHOD_INVOKER_PIPE_HOST,
      useExisting: MyComponent
    }
  ]
})
export class MyComponent {
  ...

  public title = 'My App';

  public componentMethodThatUsesThis(): string {
    return this.title;
  }
}
```

```html
<p>{{ componentMethodThatUsesThis | invoke }}</p>
```

[⬆ Back to top](#table-of-contents)

## Mixins

Factory functions that return class definitions that can be used to dynamically constructor arbitrary prototype chains allowing you to use multiple inheritance with ease.

### Subscription Handler

A Mixin function that provides functionality related to handling subscriptions.
A class extending this mixin will have access to the `onDestroy` property that should be used in the various takeUntil operators throughout the streams defined by the concrete class.
The mixin's subscription handling logic depends on it's `ngOnDestroy` method being called by Angular. If you have to define `onDestroy$` lifecycle hook in your concrete class make sure to call `super.ngOnDestroy` as well or better yet use the [AuthHooks decorator](#autohooks) !

```ts
class MyComp extends SubscriptionHandlerMixin() {
  constructor() {
    super();
  }
}
```

[⬆ Back to top](#table-of-contents)

### Media Observer

A Mixin function that provides functionality related to observing the browser viewport's size.
A class extending this mixin will have access to various observables named after the convention followed by numerous CSS frameworks: `xs$`, `sm$`, `md$`, `lg$`, `xl$`, etc...
These observable stream will always emit a boolean value indicating if the browser's viewport currently has a size fitting that breakpoint size criteria.

```ts
class MyComp extends MediaObserver() {
  constructor() {
    super();
  }
}
```

```html
<div *ngIf="xs$ | async; else desktopTpl">...</div>
```

[⬆ Back to top](#table-of-contents)

### TrackBy Handler

A Mixin function that provides functionality related to handling track-by functions for ngFor directives used in the component's template.
A class extending this mixin will have access to a general purpose `trackBy` function that can be referenced in the component's template for ngFor directives' `trackBy` inputs.
The `trackBy` function will try to use the received objects' ids as unique keys, however this behavior can be configured in the mixin's second parameter.

```ts
class MyComp extends TrackByHandlerMixin() {
  constructor() {
    super();
  }
}
```

```html
<div *ngFor="pics of pictures; trackBy: trackBy">...</div>
```

[⬆ Back to top](#table-of-contents)

## Development environment

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

Run `npm run packagr` to build the library. The build artifacts will be stored in the `dist` directory.
