import { NgForOf } from '@angular/common';
import { Directive, Host, Inject, Input, Optional } from '@angular/core';
import { TRACK_BY_ID } from '../tokens';

/**
 * A utility directive that enhances Angular's *ngFor directive with extra functionality.
 * The directive is implicitly applied every time the original *ngFor is used
 * and provides a trackBy function to it that uses the property name from the directive input or the TRACK_BY_ID injection token's value.
 * @example
 *
 * Implicit usage of the TRACK_BY_ID Injection token's value:
 * ```html
 * <p *ngFor="let item of items$ | async">
 *   {{item}}
 * </p>
 * ```
 *
 * Supplying a track id manually per *ngFor usage:
 * ```html
 * <p *ngFor="let item of items$ | async; trackId: 'name'">
 *   {{item}}
 * </p>
 * ```
 *
 * Overriding the TRACK_BY_ID Injection token's value per component:
 * ```ts
 * \@Component({
 *  selector: 'app-root',
 *  providers: [{provide: TRACK_BY_ID, useValue: 'name'}]
 * })
 * export class AppComponent { ... }
 * ```
 * No additional work needed in the HTML.
 * ```html
 * <p *ngFor="let item of items$ | async">
 *   {{item}}
 * </p>
 * ```
 *
 * @credit
 * Ankit kaushik - https://ankit-kaushik.medium.com/
 *
 * Author's Medium article about the Directive:
 * https://ankit-kaushik.medium.com/trackid-infixing-trackby-capabilities-to-ngfor-in-a-centralised-way-across-your-angular-f1286f703469
 */
@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[ngFor][ngForOf]',
  standalone: true
})
export class NgForTrackIdDirective {
  @Input() public ngForTrackId: string = this.trackId;

  constructor(
    @Host() ngFor: NgForOf<any>,
    @Optional() @Inject(TRACK_BY_ID) private readonly trackId = 'id'
  ) {
    ngFor.ngForTrackBy ||= (index, item) =>
      (typeof item === 'object' &&
        Reflect.has(item, this.ngForTrackId) &&
        item[this.ngForTrackId]) ||
      index.toString();
  }
}
