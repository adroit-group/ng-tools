import { timer, NEVER } from 'rxjs';
import { take } from 'rxjs/operators';
import { PIPEABLE_EVENT_HANDLER } from '../tokens';

export const pipeableLogger = <T extends (event: Event) => any>(
  handler: T
): any => {
  console.log('Invoking event handler: ', handler);
};

export const pipeableTimer = async <T extends (event: Event) => any>(
  time: number = 1000
): Promise<any> => {
  await timer(+time)
    .pipe(take(1))
    .toPromise();

  console.log('timer$ elapsed');

  return NEVER;
};

function preventDefault(event: Event | any): any {
  if (typeof event?.preventDefault === 'function') {
    event.preventDefault();
  }
}

export const APP_PIPEABLE_EVENT_HANDLER_PROVIDERS = [
  {
    provide: PIPEABLE_EVENT_HANDLER,
    useValue: {
      operatesOn: 'event',
      name: 'log',
      handler: pipeableLogger,
    },
    multi: true,
  },
  {
    provide: PIPEABLE_EVENT_HANDLER,
    useValue: {
      operatesOn: 'handler',
      name: 'prevent',
      handler: preventDefault,
    },
    multi: true,
  },
  {
    provide: PIPEABLE_EVENT_HANDLER,
    useValue: {
      operatesOn: 'event',
      name: 'timer$',
      handler: pipeableTimer,
    },
    multi: true,
  },
];
