import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { EVENT_MANAGER_PLUGINS } from '@angular/platform-browser';
import { NEVER, timer } from 'rxjs';
import { take } from 'rxjs/operators';
import { LIB_DIRECTIVES } from './directives';
import { LIB_PIPES } from './pipes';
import { LIB_PROVIDERS } from './providers';
import { LIB_SERVICES, PipeableEventsPlugin } from './services';
import {
  BUSINESS_LOGIC_EXECUTOR_THROW_BEHAVIOR,
  PIPEABLE_EVENT_HANDLER,
} from './tokens';

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

export const APP_EVENT_HANDLER_PLUGIN_PROVIDERS = [
  {
    provide: EVENT_MANAGER_PLUGINS,
    useClass: PipeableEventsPlugin,
    multi: true,
  },
];

@NgModule({
  imports: [CommonModule],
  declarations: [...LIB_DIRECTIVES, ...LIB_PIPES],
  exports: [...LIB_DIRECTIVES, ...LIB_PIPES],
  providers: [
    ...APP_EVENT_HANDLER_PLUGIN_PROVIDERS,
    ...APP_PIPEABLE_EVENT_HANDLER_PROVIDERS,
  ],
})
export class AdroitNgUtilsModule {
  public static forRoot(): ModuleWithProviders<AdroitNgUtilsModule> {
    return {
      ngModule: AdroitNgUtilsModule,
      providers: [
        ...LIB_SERVICES,
        ...LIB_PIPES,
        ...LIB_PROVIDERS,
        {
          provide: BUSINESS_LOGIC_EXECUTOR_THROW_BEHAVIOR,
          useValue: false,
        },
      ],
    };
  }
}
