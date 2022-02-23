/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @internal
 */
export type ReturnTypeUnsafe<T> = T extends new (...args: any) => infer R
  ? R
  : T;

/**
 * Egy osztály konstruktor függvényének alaját leíró interface.
 *
 * @param T A példányosított konstruktor típusa.
 * @param P A konstruktor által várt paraméterek típusai.
 */
// export type Constructor<T, P = unknown[]> = {
//   new (...args: P extends Array<unknown> ? P : []) => T;
// }

export type Constructor<T, P = unknown[]> = T & {
  new (...args: P extends any[] ? P : []): ReturnTypeUnsafe<T>;
  prototype: ReturnTypeUnsafe<T>;
};
