import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { createComponentFactory } from '@ngneat/spectator';
import { randomUUID } from 'crypto';

import { FormControlNameAugmentationDirective } from './form-control-name-augmentation.directive';

describe('Directive: FormControlNameAugmentation', () => {
  const controlValue = randomUUID();

  @Component({
    viewProviders: [FormControlNameAugmentationDirective],
    template: `
      <form [formGroup]="form">
        <input
          formControlName="testControl"
          #templateVariableName="formControlName"
        />
      </form>
    `,
  })
  class TestComponent {
    @ViewChild('templateVariableName')
    exportedFormControl!: FormControlNameAugmentationDirective;
    form = new FormGroup({
      testControl: new FormControl(controlValue, [Validators.maxLength(1)]),
    });
  }

  let spectator;
  let component: TestComponent;

  const createComponent = createComponentFactory({
    component: TestComponent,
    declarations: [FormControlNameAugmentationDirective],
    imports: [CommonModule, ReactiveFormsModule],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('should hold the corresponding value', () => {
    expect(component.exportedFormControl.value).toEqual(controlValue);
    expect(component.exportedFormControl.invalid).toEqual(true);
  });
});
