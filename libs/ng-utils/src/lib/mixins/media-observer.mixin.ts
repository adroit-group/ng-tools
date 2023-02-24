/* eslint-disable @typescript-eslint/no-explicit-any */
import { BreakpointObserver } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Constructor } from '../interfaces';
import { MixinType } from '../types';
import { mixinBase } from '../utils/mixin-base';
import { resolveMixinDependency } from '../utils/resolve-mixin-dependency';

// TODO: Lehetne e zone-on kivül futtatni a streameket?
/**
 * A Mixin function that provides functionality related to observing the browser viewport's size.
 * A class extending this mixin will have access to various observables named after the convention followed by numerous CSS frameworks: xs$, sm$, md$, lg$, xl$, etc...
 * These observable stream will always emit a boolean value indicating if the browser's viewport currently has a size fitting that breakpoint size criteria.
 * @example
 * ```ts
 * class MyComp extends MediaObserver() {
 *      constructor() {
 *           super();
 *       }
 *  }
 * ```
 *
 * ```html
 * <div *ngIf="xs$ | async; else desktopTpl"> ... </div>
 * ```
 */
export function MediaObserverMixin<T extends Constructor<any, unknown[]>>(
  base?: T
) {
  const MediaObserver = class extends mixinBase(base) {
    public readonly breakpointObserver =
      resolveMixinDependency(BreakpointObserver);

    public readonly xs$ = this.observe('(max-width: 600px)');
    public readonly sm$ = this.observe('(max-width: 960px)');
    public readonly md$ = this.observe('(max-width: 1280px)');
    public readonly lg$ = this.observe('(max-width: 1600px)');
    public readonly xl$ = this.observe('(min-width: 1601px)');

    /**
     * An observable that indicates whether or not the window's viewport height is considered very low.
     */
    public readonly veryLowMediaHeight$ = this.observe('(max-height: 500px)');

    public observe(size: string): Observable<boolean> {
      return this.breakpointObserver
        .observe(size)
        .pipe(map((breakpointState) => breakpointState.matches));
    }
  };

  return MediaObserver as MixinType<typeof MediaObserver, T>;
}
