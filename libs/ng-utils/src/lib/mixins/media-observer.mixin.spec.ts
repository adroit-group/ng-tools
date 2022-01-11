import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { MediaObserverMixin } from './media-observer.mixin';
import { MixinDependencyResolverModule } from '../mixin-dependency-resolver.module';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
class MockTestService {}

describe('MediaObserverMixin', () => {
  let mixinClass: any;
  let spectator: SpectatorService<MockTestService>;

  const createService = createServiceFactory({
    service: MockTestService,
    imports: [MixinDependencyResolverModule],
  });

  beforeAll(() => (spectator = createService()));

  beforeEach(() => (mixinClass = MediaObserverMixin()));

  it('Should return a class.', () => {
    expect(typeof mixinClass).toBe('function');
  });

  it('Should instantiate the returned class', () => {
    const instance = new mixinClass();

    expect(instance).toBeDefined();
    expect(typeof instance).toBe('object');
  });

  it('Should have an isBreakPointActive function', () => {
    const instance = new mixinClass();

    expect(typeof instance.isBreakPointActive).toBe('function');
    expect(() => instance.isBreakPointActive()).not.toThrow();
  });
});
