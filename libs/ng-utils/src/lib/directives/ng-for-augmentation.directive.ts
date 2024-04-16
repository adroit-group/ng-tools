/* eslint-disable @angular-eslint/directive-selector */
import {
  Directive,
  EmbeddedViewRef,
  Input,
  OnChanges,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';

/**
 * A utility directive that enhances Angular's *ngFor directive with extra functionality.
 * The directive is implicitly applied every time the original *ngFor is used and provides two additional template options for *ngFor.
 * You can supply both a no array and an empty array template to be rendered.
 * @example ```html
 * <p *ngFor="let item of items$ | async else loading empty blank">
 *   {{item}}
 * </p>
 * ```
 * @credit
 * Alexander Inkin - https://medium.com/@waterplea
 *
 * https://medium.com/angularwave/non-binary-ngif-cfdf7c474852
 */
@Directive({
  selector: '[ngFor][ngForOf][ngForEmpty],[ngFor][ngForOf][ngForElse]',
  standalone: true
})
export class NgForAugmentationDirective<T> implements OnChanges {
  @Input()
  public ngForOf?: Array<T>;

  @Input()
  public ngForEmpty?: TemplateRef<unknown>;

  @Input()
  public ngForElse?: TemplateRef<unknown>;

  private ref?: EmbeddedViewRef<unknown>;

  constructor(private readonly vcr: ViewContainerRef) {}

  public ngOnChanges(): void {
    this.ref?.destroy();

    if (!Array.isArray(this.ngForOf) && this.ngForElse instanceof TemplateRef) {
      this.ref = this.vcr.createEmbeddedView(this.ngForElse);
      return;
    }

    if (this.ngForOf?.length === 0 && this.ngForEmpty instanceof TemplateRef) {
      this.ref = this.vcr.createEmbeddedView(this.ngForEmpty);
    }
  }
}
