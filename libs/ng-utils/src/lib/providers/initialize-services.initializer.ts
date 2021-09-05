import { APP_INITIALIZER, Provider } from '@angular/core';
import { IInitializable } from '../interfaces';
import { INITIALIZABLE_SERVICE } from '../tokens';

/**
 * Egy initializer token, mely az alkalamzás indításakor összegyüjti az inicializálható service osztályokat
 * és azokon sorban meghívja az init függvényt az IInitializable interface alapján.
 */
export const INITIALIZABLE_SERVICES_INITIALIZER: Provider = {
  provide: APP_INITIALIZER,
  useFactory: (initializables: Array<IInitializable>) => (): void => {
    const servicesToInitializer = Array.isArray(initializables)
      ? initializables
      : [];

    for (const initializable of servicesToInitializer) {
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
  deps: [INITIALIZABLE_SERVICE],
  multi: true,
};
