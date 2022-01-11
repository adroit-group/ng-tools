import { BusinessLogicExecutor } from './business-logic-executor.service';
import { BusinessLogicRegistry } from './business-logic-registry.service';
import { PipeableEventsPlugin } from './pipeable-events-plugin.service';
import { PlatformObserver } from './platform-observer.service';

export { BusinessLogicExecutor } from './business-logic-executor.service';
export { BusinessLogicRegistry } from './business-logic-registry.service';
export { PipeableEventsPlugin } from './pipeable-events-plugin.service';
export { PlatformObserver as PlatformObserverService } from './platform-observer.service';

/**
 * @internal
 */
export const LIB_SERVICES = [
  BusinessLogicExecutor,
  BusinessLogicRegistry,
  PipeableEventsPlugin,
  PlatformObserver,
];
