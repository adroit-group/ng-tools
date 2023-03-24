/* eslint-disable @typescript-eslint/triple-slash-reference */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

/// <reference path="../typings.d.ts" />

import { EnvironmentInjector, inject } from '@angular/core';
import { bindDescriptor } from './bind-descriptor';
import { wrapClass } from './wrap-class';

/**
 * Decorator that frees your classes from the shackles of Angular DI.
 * Allowing them to fully utilize it without requiring Angular's class decorators: Component, Directive, Injectable, Pipe, Module.
 *
 * The decorator can be used as a class, method, get/set accessor decorator.
 * But you
 *
 * @example ```ts
 * \@Unchained()
 * class MyClass {
 *   router: Router;
 *
 *   routerFn = () => inject(Router);
 *
 *   static routerFn = () => inject(Router);
 *
 *   constructor() {
 *     this.router = inject(Router);
 *   }
 *
 *   getTitleService() {
 *     const title = inject(Title);
 *
 *     console.log('title: ', title);
 *   }
 *
 *   public get neta() {
 *     return inject(Meta);
 *   }
 *
 *   public static get appRef() {
 *     return inject(ApplicationRef);
 *   }
 *
 *   static getRouter() {
 *     return inject(Router);
 *   }
 * }
 * ```
 */
function Unchained() {
  return (
    target: any,
    propKey?: PropertyKey,
    descriptor?: TypedPropertyDescriptor<any>
  ): any => {
    const mode: 'class' | 'method' =
      !!propKey && typeof descriptor === 'object' ? 'method' : 'class';

    return mode === 'method'
      ? bindDescriptor(target, propKey!, descriptor!)
      : wrapClass(target);
  };
}

/**
 * Decorator the marks an Angular NgModule as the DI provider for `@Unchained` classes.
 *
 * By marking an `NgModule` with this decorator you set it as the ModuleInjector target for providers requested.
 *
 * Use it on your root module (AppModule).
 *
 * @note The normal DI resolution rules apply to `Unchained` classes and their providers as well.
 * e.g.: Providers provided in their own lazy-loaded modules' providers array ARE NOT resolvable in other modules contexts.
 *
 * @example ```ts
 * \@DI()
 * \@NgModule({
 *  declarations: [AppComponent],
 *  imports: [BrowserModule, AppRoutingModule],
 *  providers: [],
 *  bootstrap: [AppComponent],
 * })
 * export class AppModule {}
 * ```
 */
function DI(): ClassDecorator {
  return (target: any) => {
    return new Proxy(target, {
      construct(target, argArray, newTarget) {
        const instance = Reflect.construct(target, argArray, newTarget);

        window.DI_UNCHAINED_INJECTOR_SYMBOL = inject(EnvironmentInjector);

        return instance;
      },
    });
  };
}

/**
 *
 */
const DIContextProvider = DI;

/**
 *
 */
const WithDIContext = Unchained;

export { DI, DIContextProvider, Unchained, WithDIContext };
