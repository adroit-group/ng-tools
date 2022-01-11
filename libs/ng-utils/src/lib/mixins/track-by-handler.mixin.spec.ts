import { TrackByHandlerMixin } from './track-by-handler.mixin';

describe('TrackByHandlerMixin', () => {
  let mixinClass: any;

  beforeEach(() => {
    mixinClass = TrackByHandlerMixin();
  });

  it('Should return a class.', () => {
    expect(typeof mixinClass).toBe('function');
  });

  it('Should instantiate the returned class', () => {
    const instance = new mixinClass();

    expect(instance).toBeDefined();
    expect(typeof instance).toBe('object');
  });

  it('Should have a trackBy function', () => {
    const instance = new mixinClass();

    expect(typeof instance.trackBy).toBe('function');
    expect(() => instance.trackBy(0, '')).not.toThrow();
  });
});
