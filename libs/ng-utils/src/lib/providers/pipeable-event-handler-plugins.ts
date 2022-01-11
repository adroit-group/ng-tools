import { Provider } from '@angular/core';
import { EVENT_MANAGER_PLUGINS } from '@angular/platform-browser';

import { PipeableEventsPlugin } from '../services';

export const APP_EVENT_HANDLER_PLUGIN_PROVIDERS: Provider[] = [
  {
    provide: EVENT_MANAGER_PLUGINS,
    useClass: PipeableEventsPlugin,
    multi: true,
  },
];
