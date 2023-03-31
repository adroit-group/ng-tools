/* eslint-disable @typescript-eslint/triple-slash-reference */
/// <reference path="../typings.d.ts" />

/**
 * @internal
 */
export function runInContext<T extends () => any>(fn: T): ReturnType<T> {
  const envInjector = window.DI_UNCHAINED_INJECTOR_SYMBOL;

  return envInjector.runInContext(fn);
}
