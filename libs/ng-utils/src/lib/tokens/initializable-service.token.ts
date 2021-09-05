import { InjectionToken } from '@angular/core';
import { IInitializable } from '../interfaces';

/**
 * Az alkalmazás indításával inicializálandó service-k regisztrálásához használt InjectionToken
 */
export const INITIALIZABLE_SERVICE = new InjectionToken<IInitializable>(
  'initializable service'
);
