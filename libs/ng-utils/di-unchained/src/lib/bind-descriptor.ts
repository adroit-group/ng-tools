import { runInContext } from "./run-in-context";

/**
 * @internal
 */
export function bindDescriptor(
  target: object,
  member: PropertyKey,
  descriptor: TypedPropertyDescriptor<unknown> & PropertyDescriptor
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
    descriptor['value'] = (...args: unknown[]) => runInContext(() => value(args));
    changed++;
  }

  if (changed) {
    Object.defineProperty(target, member, descriptor);
  }
}
