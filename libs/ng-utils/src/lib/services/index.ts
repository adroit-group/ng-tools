import { BusinessLogicExecutor } from './business-logic-executor.service';
import { BusinessLogicRegistry } from './business-logic-registry.service';

export { BusinessLogicExecutor } from './business-logic-executor.service';

export const LIB_SERVICES = [BusinessLogicExecutor, BusinessLogicRegistry];
