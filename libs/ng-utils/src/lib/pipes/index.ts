import { MethodInvokerModule } from './method-invoker';
import { SafeModule } from './safe';

export { SafeModule, SafePipe } from './safe';
export { MethodInvokerModule, MethodInvokerPipe } from './method-invoker';

/**
 * @internal
 */
export const LIB_PIPES = [MethodInvokerModule, SafeModule];
