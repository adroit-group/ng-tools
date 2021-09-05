import { InjectionToken } from '@angular/core';
import { EMPTY, NEVER, Observable } from 'rxjs';

export type NgSubscribeBehaviorHandler = (
  ...deps: Array<unknown>
) => Observable<unknown>;

type MayThrow<T> = T | never;

export type NgSubscribeBehavior =
  | Observable<unknown>
  | NgSubscribeBehaviorHandler;

export const NG_SUBSCRIBE_EXCEPTION_BEHAVIOR = new InjectionToken<
  MayThrow<NgSubscribeBehavior>
>('NgSubscribe directive exception behavior', {
  factory: (): Observable<unknown> => NEVER,
});

export const NG_SUBSCRIBE_MISSING_STREAM_BEHAVIOR =
  new InjectionToken<NgSubscribeBehavior>(
    'NgSubscribe directive missing stream behavior',
    {
      factory: (): Observable<unknown> => EMPTY,
    }
  );
