import { Inject, Injectable, OnDestroy } from '@angular/core';
import { EventManager } from '@angular/platform-browser';
import { Subject, Subscription } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { isAsyncGenerator, observify } from '../functions';
import { IDottableEventHandlerAlias } from '../interfaces/dottable-event-handler-alias';
import { DOTTABLE_EVENT_METHOD_ALIAS } from '../tokens';

@Injectable()
export class DottableEventsPluginService implements OnDestroy {
  private readonly _dotSubscripions: Array<Subscription> = [];

  public manager!: EventManager;

  private get aliases(): IDottableEventHandlerAlias[] {
    return this.registeredAliases && Array.isArray(this.registeredAliases)
      ? this.registeredAliases
      : [this.registeredAliases];
  }

  constructor(
    @Inject(DOTTABLE_EVENT_METHOD_ALIAS)
    private readonly registeredAliases:
      | IDottableEventHandlerAlias
      | IDottableEventHandlerAlias[]
  ) {
    this.validateRegisteredHandlers();
  }

  public ngOnDestroy(): void {
    this._dotSubscripions.forEach(
      (sub) => sub && !sub.closed && sub.unsubscribe()
    );
  }

  public supports(eventName: string): boolean {
    const pipeNames = this.extractPipeNames(eventName);

    return this.handlers.some((handler) => pipeNames.includes(handler.name));
  }

  public addEventListener(
    element: HTMLElement,
    eventName: string,
    handler: Function
  ): Function {
    const zone = this.manager.getZone();
    const event = this.extractEventName(eventName);
    const pipeHandlersWithArgs = this.gatherPipeableHandlers(eventName);

    const removeSignal$ = new Subject<void>();

    const outsideHandler = async (e: unknown): Promise<void> => {
      let shouldStop = false;
      let currEvent = e;

      removeSignal$.subscribe(() => (shouldStop = true));

      for (const handlerConfig of pipeHandlersWithArgs) {
        if (shouldStop) {
          break;
        }

        const returnVal = handlerConfig.pipeHandler(
          currEvent,
          removeSignal$,
          ...handlerConfig.handlerArgs
        );

        if (isAsyncGenerator(returnVal)) {
          currEvent = await observify(returnVal)
            .pipe(take(1), takeUntil(removeSignal$))
            .toPromise();
        } else {
          currEvent = returnVal;
        }
      }

      zone.run(() => handler(currEvent));
    };

    // Executed outside of angular so that change detection is not constantly triggered.
    zone.runOutsideAngular(() =>
      this.manager.addEventListener(element, event, outsideHandler)
    );

    return (): void => {
      element.removeEventListener(event, outsideHandler);
      removeSignal$.next();
      removeSignal$.complete();
    };
  }

  private gatherPipeableHandlers(eventName: string) {
    return (
      eventName
        .split('|')
        .filter((_name, index) => index !== 0)
        .filter((pipeableName) => eventName.includes(pipeableName))
        .map((handlerNameWithArgs) => {
          const [handlerName, ...handlerArgs] = handlerNameWithArgs.split('.');
          const pipeable = this.handlers.find(
            (pipeableHandler) => pipeableHandler.name === handlerName
          );

          if (typeof pipeable !== 'object') {
            throw new Error(``);
          }

          const { operatesOn, handler } = pipeable;

          // const handlerToApply =
          //   operatesOn === 'handler'
          //     ? (handler as PipeableEventHandlerHandlerOperation)(...handlerArgs)
          //     : handler;

          return {
            operatesOn,
            pipeHandler: handler,
            handlerArgs,
          };
        })
        // ? with the applied handler fn composition the declared order is reversed in called order, that's why we have to revers it again
        .reverse()
    );
  }

  private extractPipeNames(eventName: string): string {
    return eventName.substr(eventName.indexOf('|')) || '';
  }

  private extractEventName(eventName: string): string {
    return eventName.substring(0, eventName.indexOf('|')) || '';
  }

  private validateRegisteredHandlers(): void {
    const registeredNames: Array<string> = [];

    for (const registeredHandler of this.handlers) {
      if (typeof registeredHandler !== 'object') {
        throw new Error();
      }

      const { name, operatesOn, handler } = registeredHandler;

      if (!operatesOn) {
        throw new Error();
      }

      if (operatesOn !== 'event' && operatesOn !== 'handler') {
        throw new Error();
      }

      if (registeredNames.includes(name)) {
        throw new Error();
      }

      if (typeof handler !== 'function') {
        throw new Error();
      }

      registeredNames.push(name);
    }
  }
}
