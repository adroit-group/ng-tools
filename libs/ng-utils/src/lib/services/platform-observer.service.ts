import {
  isPlatformBrowser,
  isPlatformServer,
  isPlatformWorkerUi,
} from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { WINDOW } from '../tokens/window-ref.token';

/**
 * An Injectable service that helps to identify the platform where the application runs.
 */
@Injectable({
  providedIn: 'root',
})
export class PlatformObserverService {
  /**
   * Gets whether the app is running in the browser
   */
  public get isPlatformBrowser(): boolean {
    return isPlatformBrowser(this.platformID);
  }

  /**
   * Gets whether the app is running on the server
   */
  public get isPlatformServer(): boolean {
    return isPlatformServer(this.platformID);
  }

  /**
   * Gets whether the app is running in the web worker
   */
  public get isPlatformWorker(): boolean {
    return isPlatformWorkerUi(this.platformID);
  }

  /**
   * @param platformID The platform id of the platform where the application is running
   */
  constructor(
    @Inject(PLATFORM_ID) public readonly platformID: string,
    @Inject(WINDOW) public readonly window: Window
  ) {}
}
