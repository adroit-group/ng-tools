import { Constructor } from '~interfaces';

/**
 * @summary Given a Constructor type gets the instance type created by the constructor.
 */
type PrototypeOf<T> = T extends Constructor<infer P, any[]> ? P : never;

/**
 * @summary Given a Constructor type gets the parameters expected by it.
 */
type CtorParams<T> = T extends Constructor<any, infer Params> ? Params : [];

/**
 * @summary Concatenates two tuples together.
 */
type ConcatTuples<T extends any[], U extends any[]> = [...T, ...U];

/**
 * @summary Asserts tha the given type T is a tuple.
 */
type CastToTuple<T> = T extends any[] ? T : never;

/**
 * @summary Composes two types together the same way the ES spread operator does.
 * @description While merging the provided types overrides the common properties in the correct order.
 */
type ComposeTypes<T1, T2> = {
  [K2 in keyof T2]: K2 extends keyof T1 ? T1[K2] : T2[K2];
} &
  { [K1 in keyof T1]: T1[K1] } &
  T2 &
  T1;

/**
 * @summary Merges the types supplied in the supplied tuple recursively.
 * @description While merging the types maintains their correct order as in a classical inheritance.
 * @remarks The merged types override each others common properties in the proper order.
 */
type Compose<
  T extends any[],
  TCurr extends any = T[0],
  Acc extends any = Record<any, any>
> = TCurr extends undefined ? Acc : ComposeTypes<Acc, TCurr>;

/**
 * @summary The special constructor type used by mixin functions.
 * Returns a regular constructor type with the appropriate instance type and constructor parameters
 * after merging the types of the supplied mixin functions' results.
 */
export type MixinType<
  Base,
  Mixin,
  Params extends any[] = []
> = Base extends FunctionConstructor
  ? Constructor<Mixin, Params>
  : Constructor<
      ComposeTypes<Mixin, PrototypeOf<Base>>,
      ConcatTuples<Params, CastToTuple<CtorParams<Base>>>
    >;
