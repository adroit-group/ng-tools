/**
 * A typed hash map that can be used to strongly type JS objects and similar data structures.
 *
 * @param T The type of the key used by the object. Default to string.
 * @param U The type of the values stored in the object. Defaults to unknown.
 */
export type HashMap<T extends PropertyKey = PropertyKey, U = unknown> = {
  [key in T]: U;
};
