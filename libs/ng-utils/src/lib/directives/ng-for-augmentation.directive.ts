/* eslint-disable @angular-eslint/directive-selector */
import { NgForOf } from '@angular/common';
import {
  Directive,
  EmbeddedViewRef,
  Host,
  Input,
  OnChanges,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { TrackByHandlerMixin } from 'mixins';

@Directive({
  selector: '[ngFor][ngForOf][ngForEmpty]',
})
export class NgForAugmentationDirective<T>
  extends TrackByHandlerMixin()
  implements OnChanges
{
  @Input()
  public ngForOf: Array<T> = [];

  @Input()
  public ngForEmpty!: TemplateRef<unknown>;

  @Input()
  public ngForElse?: TemplateRef<unknown>;

  private ref?: EmbeddedViewRef<unknown>;

  constructor(
    private readonly vcr: ViewContainerRef,
    @Host() private readonly directive: NgForOf<T>
  ) {
    super();
  }

  public ngOnChanges(): void {
    if (typeof this.directive.ngForTrackBy !== 'function') {
      this.directive.ngForTrackBy = this.trackBy;
    }

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
