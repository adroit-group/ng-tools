/* eslint-disable @typescript-eslint/no-explicit-any */
import { Observable } from 'rxjs';

/**
 * Egy segédfüggvény, mely eldönti a kapott értékről, hogy az képes-e async értékeket előállítani.
 * A függvény azt vizsgála meg, hogy az érték RXJS observable vagy natív Promise osztályok valamely példánya.
 *
 * @param value Az érték, melyről döntést kell hozni.
 */
export function isAsyncGenerator(
  value: unknown
): value is Observable<any> | Promise<any> {
  return value instanceof Observable || value instanceof Promise;
}
