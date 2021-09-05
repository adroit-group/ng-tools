import { from, Observable, of } from 'rxjs';
import { AsyncValue } from '../types';

/**
 * Egy segedfüggvény, mely a kapott értékből RXJS observable-t csinál.
 *
 * @param value Az átalakítandó érték.
 */
export function observify<T>(value: T | AsyncValue<T>): Observable<T> {
  if (value instanceof Observable) {
    return value;
  }

  if (value instanceof Promise) {
    return from(value);
  }

  return of(value as T);
}
