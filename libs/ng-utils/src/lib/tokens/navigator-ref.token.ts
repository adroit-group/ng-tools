import { isPlatformBrowser } from '@angular/common';
import { inject, InjectionToken, PLATFORM_ID } from '@angular/core';
import { WINDOW } from './window-ref.token';

/**
 * An InjectionToken used to safely access the navigator global object in the browser and worker contexts respectively.
 *
 * @throws TypeError: If used in an environment without window or navigator like global objects.
 */
export const NAVIGATOR = new InjectionToken<Navigator | null>(
  'NavigatorToken',
  {
    factory: (): Navigator | null => {
      const platformId = inject(PLATFORM_ID) as string;
      const window = inject(WINDOW);

      return isPlatformBrowser(platformId) && !!window
        ? window.navigator
        : null;
    },
  }
);
