import { InjectionToken } from '@angular/core';
import { IBusinessLogicConfig } from '../interfaces';

export const BUSINESS_LOGIC_CONFIG = new InjectionToken<IBusinessLogicConfig>(
  'Business logic config'
);
