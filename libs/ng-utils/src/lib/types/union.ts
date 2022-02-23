/* eslint-disable @typescript-eslint/no-explicit-any */
import { LastOf, Push } from './tuple';

export type UnionToIntersection<U> = (
  U extends any ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never;

// TS4.1+
export type UnionToTuple<
  T,
  L = LastOf<T>,
  N = [T] extends [never] ? true : false
> = true extends N ? [] : Push<UnionToTuple<Exclude<T, L>>, L>;

type SplitUnionToFuncDefs<U> = UnionToIntersection<
  U extends any ? (f: U) => void : never
>;

// type Reverse<T extends any[], Acc extends any[] = []> = T extends []
//   ? Acc
//   : Reverse<Tail<T>, Acc extends [] ? [T[0]] : Prepend<Acc, T[0]>>;
// type testRevers = Reverse<[string, number, boolean]>;

export type LastOfUnion<U> = SplitUnionToFuncDefs<U> extends (
  a: infer A
) => void
  ? A
  : never;
