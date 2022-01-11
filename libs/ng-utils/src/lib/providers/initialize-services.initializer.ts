import {
  APP_INITIALIZER,
  Provider,
  Injector,
  InjectFlags,
} from '@angular/core';
import { IInitializable } from '../interfaces';
import { INITIALIZABLE_SERVICE } from '../tokens';

export const INITIALIZABLE_SERVICES_INITIALIZER: Provider = {
  provide: APP_INITIALIZER,
  useFactory: (injector: Injector) => (): void => {
    const initializables = injector.get<IInitializable[]>(
      INITIALIZABLE_SERVICE,
      undefined,
      InjectFlags.Optional
    );

    if (!Array.isArray(initializables)) {
      return;
    }

    for (const initializable of initializables) {
      if (typeof initializable?.init !== 'function') {
        console.error(`
          Service: ${initializable?.constructor?.name} is registered as an initializable service
          but doesn't implement the IInitializable interface.
        `);
        continue;
      }

      initializable.init();
    }
  },
  deps: [Injector],
  multi: true,
};
