import { NgZone } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

/**
 * An RXJS operator function that runs the supplied callback function outside Angular's zone thus bypassing change detection.
 */
export function outsideZone<T>(zone: NgZone) {
  return function (source: Observable<T>): Observable<T> {
    return new Observable((observer) => {
      let sub!: Subscription;
      zone.runOutsideAngular(() => {
        sub = source.subscribe(observer);
      });

      return sub;
    });
  };
}
