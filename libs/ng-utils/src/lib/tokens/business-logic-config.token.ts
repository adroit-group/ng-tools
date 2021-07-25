import { InjectionToken } from '@angular/core';
import { IBusinessLogicConfig } from '../interfaces';

/**
 * Az alkalmazásban használt üzleti logikák regisztrálásához használt InjectionToken.
 */
export const BUSINESS_LOGIC_CONFIG = new InjectionToken<IBusinessLogicConfig>(
  'Business logic config'
);
