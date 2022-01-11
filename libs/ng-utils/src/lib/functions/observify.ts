import { from, Observable, of } from 'rxjs';
import { AsyncValue } from '../types';
import { isAsyncGenerator } from './is-async-generator';

export function observify<T>(value: T | AsyncValue<T>): Observable<T> {
  return isAsyncGenerator(value) ? from(value) : of(value as T);
}
