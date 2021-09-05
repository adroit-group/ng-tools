import { Subscribable } from 'rxjs';

/**
 * A direktíva által kezelt aszinkron értéke lehetséges típusa
 */
export type AsyncValue<T> = PromiseLike<T> | Subscribable<T>;
