/**
 * A method invoker Pipe által meghívható függvények alakjét leíró típus
 *
 * @param arg0 a meghívandó függvény első paramétere
 * @param restArgs a meghívandó függvény többi paraméterét tartalmazó lista
 */
export type InvokableMethod<T extends unknown, U> = (
  arg0: T,
  ...restArgs: Array<unknown>
) => U;
