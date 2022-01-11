import { Observable } from 'rxjs';

/**
 * Given an object or class type transforms in into the same type with all the properties and method returning their respective types wrapped into observables.
 */
export type ObservifyType<T> = {
  [K in keyof T]: T[K] extends Observable<any>
    ? T[K]
    : T[K] extends Promise<infer PromiseRes>
    ? Observable<PromiseRes>
    : Observable<T[K]>;
};

// type testObservifyType = ObservifyType<{
//   foo: string;
//   bar: Promise<number>;
//   baz: Observable<boolean>;
// }>;
