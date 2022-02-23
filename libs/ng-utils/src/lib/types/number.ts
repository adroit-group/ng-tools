/* eslint-disable @typescript-eslint/no-explicit-any */
import { CastToTuple, Prepend, Tail } from './tuple';

/**
 * A type that casts another type to number or returns never.
 */
export type CastToNumber<N> = N extends number ? N : never;

/**
 * A utility type that turn a number type to a tuple with the same length
 */
export type NumberToTuple<
  N extends number,
  L extends any[] = []
> = L['length'] extends N
  ? CastToTuple<L>
  : NumberToTuple<N, Prepend<L, L['length']>>;

/**
 * A utility type that executes a single increment operation on a number type.
 */
export type Increase<I extends number> = CastToNumber<
  [0, ...NumberToTuple<I>]['length']
>;

/**
 * A utility type that executes a single decrement operation on a number type.
 */
export type Decrease<N extends number> = NumberToTuple<N> extends infer Tuple
  ? CastToNumber<Tail<CastToTuple<Tuple>>['length']>
  : never;
