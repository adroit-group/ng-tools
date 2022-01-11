import { MediaObserver as FlexMediaObserver } from '@angular/flex-layout';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Constructor } from '../interfaces';
import { Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { MixinType } from '../types';
import { resolveMixinDependency } from '../utils/resolve-mixin-dependency';
import { mixinBase } from '../utils/mixin-base';

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
    public readonly mediaObserver = resolveMixinDependency(FlexMediaObserver);

    public readonly breakpointObserver =
      resolveMixinDependency(BreakpointObserver);

    public readonly xs$ = this.isBreakPointActive('xs');
    public readonly sm$ = this.isBreakPointActive('sm');
    public readonly md$ = this.isBreakPointActive('md');

    /**
     * An observable that indicates whether or not the window's viewport height is considered very low.
     */
    public readonly veryLowMediaHeight$ = this.breakpointObserver
      .observe('(max-height: 500px)')
      .pipe(map((breakpointState) => breakpointState.matches));

    /**
     * Determines if a given media breakpoint is considered active based on the browser window's viewport size.
     * @param breakPoint The breakpoint to check
     */
    public isBreakPointActive(
      breakPoint: string | Array<string>
    ): Observable<boolean> {
      return this.mediaObserver.asObservable().pipe(
        map((matches) =>
          Array.isArray(breakPoint)
            ? matches.some((media) => breakPoint.includes(media.mqAlias))
            : matches.some((media) => breakPoint === media.mqAlias)
        ),
        distinctUntilChanged()
      );
    }
  };

  return MediaObserver as MixinType<typeof MediaObserver, T>;
}
