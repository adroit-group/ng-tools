import { Subscribable } from 'rxjs';

/**
 * A type that describes the shape of async like values.
 */
export type AsyncValue<T> = PromiseLike<T> | Subscribable<T>;
