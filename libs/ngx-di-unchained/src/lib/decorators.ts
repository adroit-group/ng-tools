import {
  APP_INITIALIZER,
  EnvironmentInjector,
  inject,
  Provider,
} from '@angular/core';

/**
 * @internal
 */
const injectorSym = Symbol('__DI:InjectorSym__');
/**
 * @internal
 */
function runInContext<T extends () => any>(fn: T): ReturnType<T> {
  const envInjector = (globalThis as any)[injectorSym] as EnvironmentInjector;

  return envInjector.runInContext(fn);
}
/**
 * @internal
 */
function bindDescriptor(
  target: Object,
  member: PropertyKey,
  descriptor: TypedPropertyDescriptor<any> & PropertyDescriptor
) {
  const { get, set, value } = descriptor;
  let changed = 0;

  if (typeof get === 'function') {
    descriptor['get'] = () => runInContext(() => get());
    changed++;
  }

  if (typeof set === 'function') {
    descriptor['set'] = (arg) => runInContext(() => set(arg));
    changed++;
  }

  if (typeof value === 'function') {
    descriptor['value'] = (...args: any[]) => runInContext(() => value(args));
    changed++;
  }

  if (!!changed) {
    Object.defineProperty(target, member, descriptor);
  }
}
/**
 * @internal
 */
function bindCLass(protoOrCtor: Object) {
  const protoMembers = Object.entries(
    Object.getOwnPropertyDescriptors(protoOrCtor)
  ).filter(
    ([member, descriptor]) =>
      (typeof descriptor.value === 'function' && member !== 'constructor') ||
      descriptor.get ||
      descriptor.set
  );

  protoMembers.forEach(([member, descriptor]) =>
    bindDescriptor(protoOrCtor, member, descriptor)
  );
}
/**
 * @internal
 */
function wrapClass(target: any) {
  const proto = target.prototype;
  if (!target || !proto) return;

  bindCLass(proto);
  bindCLass(target);

  return new Proxy(target, {
    construct: (target, argArray, newTarget) => {
      return runInContext(() => Reflect.construct(target, argArray, newTarget));
    },
  });
}
/**
 * A Provider definition used by the ˙NgxDiUnchainedModule˙
 * to expose the `EnvironmentInjector`'s instance on the global scope with an `APP_INITIALIZER` function.
 *
 * @internal
 */
const EXPOSE_ENV_INJECTOR_INITIALIZER: Provider = {
  provide: APP_INITIALIZER,
  multi: true,
  useFactory: () =>
    ((globalThis as any)[injectorSym] = inject(EnvironmentInjector)),
};
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
  ) => {
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

        (globalThis as any)[injectorSym] = inject(EnvironmentInjector);

        return instance;
      },
    });
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
const DIContextProvider = DI;
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
const WithDIContext = Unchained;

export {
  DI,
  DIContextProvider,
  EXPOSE_ENV_INJECTOR_INITIALIZER,
  Unchained,
  WithDIContext,
};
