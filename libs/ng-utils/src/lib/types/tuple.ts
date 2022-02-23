/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Increase } from './number';
import { UnionToIntersection } from './union';

/**
 * @summary Asserts tha the given type T is a tuple.
 */
export type CastToTuple<T> = T extends any[] ? T : never;

/**
 * @summary Concatenates two tuples together.
 */
export type ConcatTuples<T extends any[], U extends any[]> = [...T, ...U];

export type LastOf<T> = UnionToIntersection<
  T extends any ? () => T : never
> extends () => infer R
  ? R
  : never;

// TS4.0+
export type Prepend<T extends any[], U> = [U, ...T];

// TS4.0+
export type Push<T extends any[], V> = [...T, V];

export type Tail<T extends any[]> = T extends [any, ...infer Rest]
  ? Rest
  : never;

export type Last<T extends any[]> = T[Exclude<keyof T, keyof Tail<T>>];

export type Head<T extends any[]> = T extends [...infer Head, any]
  ? Head
  : T extends [infer First]
  ? [First]
  : [];

export type TupleToMapped<
  T extends any[],
  Acc = {},
  Index extends number = 0
> = T extends [infer Head, ...infer Tail]
  ? TupleToMapped<Tail, Acc & Record<Index, Head>, Increase<Index>>
  : Acc;

// type testTupleToMapped = TupleToMapped<[string, number, ...any[]]>;
// type t12 = testTupleToMapped extends {} ? 1 : 0;

// type testTupleToMappedWithRest = TupleToMapped<[string, boolean, ...any[]]>;
// type mappedKeysAsUnion = keyof testTupleToMappedWithRest;
// type mappedKeysAsTuple = UnionToTuple<mappedKeysAsUnion>;

// type testMappedTpoTupleMapped = MappedToTupleMapper<
//   mappedKeysAsTuple,
//   testTupleToMappedWithRest
// >;

// type testMappedToTuple = MappedToTuple<testTupleToMappedWithRest>;
