/* eslint-disable no-undef */
import { isPlatformBrowser } from '@angular/common';
import { inject, InjectionToken, PLATFORM_ID } from '@angular/core';

/**
 * An InjectionToken used to safely access window and workerGlobalScope in browser and worker contexts respectively.
 *
 * @throws TypeError: If used in the context of platformServer.
 */
export const WINDOW = new InjectionToken<Window | null>(
  'Window global scope token',
  {
    providedIn: 'root',
    factory: (): Window | null => {
      const platformId = inject(PLATFORM_ID);

      return isPlatformBrowser(platformId) ? globalThis.window : null;
    },
  }
);
