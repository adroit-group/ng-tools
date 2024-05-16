import { Inject, Optional, Pipe, PipeTransform } from '@angular/core';
import { METHOD_INVOKER_PIPE_HOST } from '../../tokens/method-invoker-pipe-host.token';
import { InvokableMethod } from '../../types';

// TODO: Add content arg to transform so that this can be set more easily and explicitly than with the method invoker pipe host token

/**
 * A meta pipe that aims to replace most or all other pipes in your application.
 * This pipe take a function and optionally it's arguments as parameter(s) an executes it.
 * A context object can be supply to the pipe through Angular's DI system
 * in turn enabling the usage and reference of the this parameter of the component or directive that defined the function.
 *
 * @example
 *
 * Without context
 *```html
 * <p> {{ getRelativeDateTime | invoke: orderDate }} </p>
 *```
 *
 * With context
 *```ts
 * \@component({
 *  ...
 *  providers: [
 *    {
 *      provide: METHOD_INVOKER_PIPE_HOST,
 *      useExisting: MyComponent
 *    }
 *  ]
 * })
 * export class MyComponent {
 *  ...
 *
 *  public title = 'My App';
 *
 *  public componentMethodThatUsesThis(): string {
 *    return this.title;
 *  }
 * }
 *```
 *```html
 * <p> {{ componentMethodThatUsesThis | invoke }} </p>
 *```
 */
@Pipe({
  name: 'invoke',
  standalone: true
})
export class MethodInvokerPipe implements PipeTransform {
  constructor(
    @Optional()
    @Inject(METHOD_INVOKER_PIPE_HOST)
    private readonly host?: unknown
  ) {}

  public transform<T, U>(
    value: T,
    method: InvokableMethod<T, U>,
    ...restArgs: Array<unknown>
  ): U {
    if (typeof method !== 'function') {
      throw new Error(
        `MethodInvoker Pipe expected a function but got: ${method}`
      );
    }

    return method.call(this.host, value, ...(restArgs ?? []));
  }
}
