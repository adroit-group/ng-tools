import { InjectionToken } from '@angular/core';
import { IDottableEventHandlerAlias } from '../interfaces';

export const DOTTABLE_EVENT_METHOD_ALIAS =
  new InjectionToken<IDottableEventHandlerAlias>(
    'Dottable eevent method alias'
  );
