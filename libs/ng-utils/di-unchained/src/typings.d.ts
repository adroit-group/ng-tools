import { EnvironmentInjector } from '@angular/core';

declare global {
  interface Window {
    DI_UNCHAINED_INJECTOR_SYMBOL: EnvironmentInjector;
  }
}
