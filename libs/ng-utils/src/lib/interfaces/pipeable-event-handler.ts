import { Subject } from 'rxjs';
import { PipeableEventHandlerOperationType } from '../types';

export interface IPipeableEventHandler {
  name: string;
  operatesOn: PipeableEventHandlerOperationType;
  handler: <T = Event, U = void>(
    event: T,
    stopSignal: Subject<void>,
    ...handlerArgs: unknown[]
  ) => U;
}
