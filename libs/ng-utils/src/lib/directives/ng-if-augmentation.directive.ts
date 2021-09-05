/* eslint-disable @angular-eslint/directive-selector */
import { NgIf, NgIfContext } from '@angular/common';
import { Directive, Host, Input, OnChanges, TemplateRef } from '@angular/core';

@Directive({
  selector: '[ngIf][ngIfOr],[ngIf][ngIfBut]',
})
export class NgIfAugmentedDirective<T> implements OnChanges {
  // Keeping track of the value
  @Input()
  public ngIf: unknown = false;

  // Keeping track of original template
  @Input()
  public ngIfThen: TemplateRef<NgIfContext<T>> = this.templateRef;

  // Keeping track of original "else" template
  @Input()
  public ngIfElse: TemplateRef<NgIfContext<T>> | null = null;

  // Template for loading state
  @Input()
  public ngIfOr: TemplateRef<NgIfContext<T>> | null = null;

  // Template for error state
  @Input()
  public ngIfBut: TemplateRef<NgIfContext<T>> | null = null;

  constructor(
    @Host() private readonly directive: NgIf<T>,
    private readonly templateRef: TemplateRef<NgIfContext<T>>
  ) {}

  public ngOnChanges(): void {
    if (!this.ngIf && this.ngIfOr) {
      this.directive.ngIfElse = this.ngIfOr;

      return;
    }

    if (this.ngIf instanceof Error && this.ngIfBut) {
      this.directive.ngIfThen = this.ngIfBut;

      return;
    }

    if (this.directive.ngIfThen !== this.ngIfThen) {
      this.directive.ngIfThen = this.ngIfThen;
    }

    if (this.directive.ngIfElse !== this.ngIfElse) {
      this.directive.ngIfElse = this.ngIfElse;
    }
  }
}
