import { Subject } from 'rxjs';
import { PipeableEventHandlerOperationType } from '../types';

export interface IPipeableEventHandler {
  name: string;
  operatesOn: PipeableEventHandlerOperationType;
  handler: <T extends any = Event, U extends any = void>(
    event: T,
    stopSignal: Subject<void>,
    ...handlerArgs: unknown[]
  ) => U;
}
