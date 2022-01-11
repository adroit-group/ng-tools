/**
 * A type that describes the shape of a function invokable by the MethodInvokerPipe
 */
export type InvokableMethod<T, U> = (arg0: T, ...restArgs: Array<unknown>) => U;
