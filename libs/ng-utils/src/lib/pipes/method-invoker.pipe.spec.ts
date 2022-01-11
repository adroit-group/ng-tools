/* eslint-disable @typescript-eslint/no-unused-vars */
import { MethodInvokerPipe } from './method-invoker.pipe';

describe('Pipe: MethodInvokerPipe', () => {
  const testFn = (input: number) => input * 10;

  it('create an instance', () => {
    expect(() =>
      new MethodInvokerPipe(null).transform(1, testFn)
    ).not.toThrow();
  });

  it('Should throw an error if a non function value is supplied as input.', () => {
    expect(() =>
      new MethodInvokerPipe(null).transform(1, undefined as any)
    ).toThrow();
  });

  it('Should invoke the supplied function and return the expected result.', () => {
    expect(new MethodInvokerPipe(null).transform(1, testFn)).toBe(10);
  });
});
