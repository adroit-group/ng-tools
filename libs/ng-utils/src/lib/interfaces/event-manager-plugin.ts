import { EventManager } from '@angular/platform-browser';

export interface EventManagerPlugin {
  manager: EventManager;
  supports(eventName: string): boolean;
  addEventListener(
    element: HTMLElement,
    eventName: string,
    handler: Function
  ): Function;
}
