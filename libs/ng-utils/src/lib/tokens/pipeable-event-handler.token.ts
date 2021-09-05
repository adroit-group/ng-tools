import { InjectionToken } from '@angular/core';
import { IPipeableEventHandler } from '../interfaces';

export const PIPEABLE_EVENT_HANDLER = new InjectionToken<IPipeableEventHandler>(
  'Pipeable Event Handlers'
);
