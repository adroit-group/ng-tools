/* eslint-disable @angular-eslint/directive-selector */
import { Directive } from '@angular/core';
import { FormControlName } from '@angular/forms';

@Directive({
  selector: '[formControlName]',
  exportAs: 'formControlName',
  standalone: true
})
export class FormControlNameAugmentationDirective extends FormControlName {}
