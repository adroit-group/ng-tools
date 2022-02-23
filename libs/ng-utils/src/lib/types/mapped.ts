/* eslint-disable @typescript-eslint/no-explicit-any */
import { CastToNumber, Increase } from './number';
import { UnionToTuple } from './union';

/**
 * A type that describes the shape of a hashmap with number only keys
 */
export type NumMap<T> = { [key: number]: T };

/**
 * A utility type that transforms a mapped type to a tuple type containing it's value types.
 */
export type MappedToTuple<T extends NumMap<any>> = MappedToTupleMapper<
  UnionToTuple<keyof T>,
  T
>;

/**
 ** ---------------------------- LOCAL ----------------------------------
 */
type MappedToTupleMapper<
  T extends any[],
  Mapped extends { [key: number]: any },
  Acc extends any[] = [],
  Index extends number = 0
> = T extends [infer Head, ...infer Tail]
  ? MappedToTupleMapper<
      Tail,
      Mapped,
      [...Acc, Mapped[CastToNumber<Head>]],
      Increase<Index>
    >
  : Acc;
