/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { MediaObserverMixin } from './media-observer.mixin';
import { MixinDependencyResolverModule } from '../mixin-dependency-resolver.module';
import { Injectable } from '@angular/core';
import { cold } from 'jest-marbles';

@Injectable({ providedIn: 'root' })
class MockTestService {}

describe('MediaObserverMixin', () => {
  let mixinClass: ReturnType<typeof MediaObserverMixin>;
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

  it('Should return an observable when observe called', () => {
    const instance = new mixinClass();

    expect(instance.observe('(max-width: 600px)')).toBeObservable(
      cold('a', { a: false })
    );
  });
});
