/* eslint-disable @typescript-eslint/ban-types */
import { bindCLass } from './bind-class';
import { runInContext } from './run-in-context';

/**
 * @internal
 */
export function wrapClass(target: Function) {
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
