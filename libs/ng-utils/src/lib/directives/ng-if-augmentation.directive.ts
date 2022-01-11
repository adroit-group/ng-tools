/* eslint-disable @angular-eslint/directive-selector */
import { NgIf, NgIfContext } from '@angular/common';
import { Directive, Host, Input, OnChanges, TemplateRef } from '@angular/core';

/**
 * A utility directive that enhances Angular's *ngIf directive with extra functionality.
 * The directive is implicitly applied every time the original *ngIf is used and provides two additional template options for *ngIF.
 * You can supply both a loading and error template for *ngIf.
 * This can be particularly useful when you are working with async data
 * @example ```html
 * <p *ngIf="value$ | async as value else default or loading but error">
 *   {{value}}
 * </p>
 * ```
 * @credit
 * Alexander Inkin - https://medium.com/@waterplea
 *
 * https://medium.com/angularwave/non-binary-ngif-cfdf7c474852
 */
@Directive({
  selector: '[ngIf][ngIfOr],[ngIf][ngIfBut]',
})
export class NgIfAugmentedDirective<T> implements OnChanges {
  /**
   * Keeping track of the value
   */
  @Input()
  public ngIf: unknown = false;

  /**
   * Keeping track of original template
   */
  @Input()
  public ngIfThen: TemplateRef<NgIfContext<T>> = this.templateRef;

  /**
   * Keeping track of original "else" template
   */
  @Input()
  public ngIfElse: TemplateRef<NgIfContext<T>> | null = null;

  /**
   * Template for loading state
   */
  @Input()
  public ngIfOr: TemplateRef<NgIfContext<T>> | null = null;

  /**
   * Template for error state
   */
  @Input()
  public ngIfBut: TemplateRef<NgIfContext<T>> | null = null;

  /**
   * @param directive The original ngIf directive instance on this host element
   * @param templateRef The template encapsulated by the directive.
   */
  constructor(
    @Host() private readonly directive: NgIf<T>,
    private readonly templateRef: TemplateRef<NgIfContext<T>>
  ) {}

  /**
   * @ignore
   */
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
