/**
 * A utility function used by mixin functions to ensure the returned mixin class expression extends from either the received base class or an empty class if no base if provided.
 *
 * @param base The provided base class
 * @example
 *
 * export function MyMixin<T extends Constructor<any, unknown[]>>(
 *   base?: T
 * ) {
 *    // ? Mixin functions class expressions should extend this function call as below
 *   const MyMixinClass = class extends mixinBase(base) {
 *     // Mixin class implementation
 *   };
 *
 *   return mixinClass(MyMixinClass, base);
 * }
 */
export function mixinBase<Base>(
  base?: Base
): new (...args: [...unknown[]]) => any {
  return (base ?? class {}) as any;
}
