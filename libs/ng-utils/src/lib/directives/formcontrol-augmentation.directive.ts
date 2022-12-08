/* eslint-disable @angular-eslint/directive-selector */
import { Directive } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[formControl]',
  exportAs: 'formControl',
})
export class FormControlAugmentationDirective {
  constructor(public host: NgControl) {}
}
