import { InjectionToken } from '@angular/core';
import { IInitializable } from '../interfaces';

export const INITIALIZABLE_SERVICE = new InjectionToken<IInitializable>(
  'initializable service'
);
