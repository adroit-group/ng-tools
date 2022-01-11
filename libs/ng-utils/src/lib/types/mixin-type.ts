import { MappedToTuple } from './mapped';
import { CastToTuple, ConcatTuples, TupleToMapped } from './tuple';
import { ReturnTypeUnsafe } from '../interfaces/constructor';

/**
 * @summary Given a Constructor type gets the instance type created by the constructor.
 */
export type PrototypeOf<T> = T extends { prototype: infer P } ? P : unknown;

/**
 * Given a tuple that contains a rest type as it's last element (usually a constructor parameter type) returns a new tuple type with the same types in it except the last rest element.
 * @example
 * type testDropRestParams =
 *  DropRestParams<[string, number, ...any[]]>; // => [string, number];
 */
type DropRestParams<T extends any[]> = MappedToTuple<TupleToMapped<T>>;

/**
 * @summary Given a Constructor type gets the parameters expected by it.
 */
type CtorParams<T> = T extends MixinConstructor<any, infer Params>
  ? CastToTuple<Params>
  : [];

// ? Working version
export type CopyStruct<T> = Pick<T, keyof T>;

// ? Working version
type ParametersUnsafe<T> = T extends new (...args: infer P) => any ? P : [];

/**
 * @summary Composes two types together the same way the ES spread operator does.
 * @description While merging the provided types overrides the common properties in the correct order.
 */
// ? Working version
type ComposeTypes<Mixin, Base> = unknown extends Base
  ? Mixin
  : unknown extends Mixin
  ? Base
  : {
      [KB in keyof Base]: KB extends keyof Mixin ? Mixin[KB] : Base[KB];
    } &
      { [KM in keyof Mixin]: Mixin[KM] };

// ? Working version
export declare type ComposePrototypes<Mixin, Base> = {
  prototype: InferProto<Base> & InferProto<Mixin>;
};

// ? Working version
type ComposeCtors<Mixin, Base> = Omit<Base, 'prototype'> &
  Omit<Mixin, 'prototype'>;
// type ComposeCtors<Mixin, Base> = Omit<ComposeTypes<Mixin, Base>, 'prototype'>;

// ? Working version
export type ComposeClasses<Mixin, Base> = ComposeCtors<Mixin, Base> &
  ComposePrototypes<Mixin, Base>;

// ? Working version
type AppendRestIfNeeded<T extends any[]> = T['length'] extends 0
  ? T
  : [...T, ...any[]];

// ? Working version
type MixinCtorParams<Mixin, Base> = AppendRestIfNeeded<
  ConcatTuples<
    DropRestParams<CtorParams<Mixin>>,
    DropRestParams<CtorParams<Base>>
  >
>;

// ? Working version
type InferProto<T> = ReturnTypeUnsafe<T> extends {
  prototype: infer Proto;
}
  ? Proto
  : ReturnTypeUnsafe<T>;

// ? Working version
export declare type MixinConstructor<
  T,
  P = ParametersUnsafe<T>
> = CopyStruct<T> & {
  new (...args: CastToTuple<P>): InferProto<T>;
  prototype: InferProto<T>;
};

/**
 * @summary The special constructor type used by mixin functions.
 * Returns a regular constructor type with the appropriate instance type and constructor parameters
 * after merging the types of the supplied mixin functions' results.
 */
// ? Working version
export type MixinType<Mixin, Base> = Base extends new (...args: any[]) => any
  ? MixinConstructor<ComposeClasses<Mixin, Base>, MixinCtorParams<Mixin, Base>>
  : MixinConstructor<Mixin>;
