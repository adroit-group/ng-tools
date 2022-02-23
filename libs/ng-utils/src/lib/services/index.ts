import { PipeableEventsPlugin } from './pipeable-events-plugin.service';
import { PlatformObserver } from './platform-observer.service';
import { QueryParamHandlerService } from './query-param-handler.service';

export { PipeableEventsPlugin } from './pipeable-events-plugin.service';
export { PlatformObserver as PlatformObserverService } from './platform-observer.service';
export { QueryParamHandlerService } from './query-param-handler.service';

/**
 * @internal
 */
export const LIB_SERVICES = [
  PipeableEventsPlugin,
  PlatformObserver,
  QueryParamHandlerService
];
