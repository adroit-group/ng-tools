import { PlatformObserver } from './platform-observer.service';
import { QueryParamHandlerService } from './query-param-handler.service';

export { PlatformObserver as PlatformObserverService } from './platform-observer.service';
export { QueryParamHandlerService } from './query-param-handler.service';

/**
 * @internal
 */
export const LIB_SERVICES = [
  PlatformObserver,
  QueryParamHandlerService
];
