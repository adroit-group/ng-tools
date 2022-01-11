import { SubscriptionHandlerMixin } from './subscription-handler.mixin';

describe('SubscriptionHandlerMixin', () => {
  let mixinClass: any;

  beforeEach(() => {
    mixinClass = SubscriptionHandlerMixin();
  });

  it('Should return a class.', () => {
    expect(typeof mixinClass).toBe('function');
  });

  it('Should instantiate the returned class', () => {
    const instance = new mixinClass();

    expect(instance).toBeDefined();
    expect(typeof instance).toBe('object');
  });

  it('Should have a ngOnDestroy function', () => {
    const instance = new mixinClass();

    expect(typeof instance.ngOnDestroy).toBe('function');
    expect(() => instance.ngOnDestroy()).not.toThrow();
  });
});
