/**
 * Egy osztály konstruktor függvényének alaját leíró interface.
 *
 * @param T A példányosított konstruktor típusa.
 * @param P A konstruktor által várt paraméterek típusai.
 */
export type Constructor<T, P = unknown[]> = new (
  ...args: P extends Array<unknown> ? P : []
) => T;
