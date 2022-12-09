import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { createComponentFactory } from '@ngneat/spectator';
import { randomUUID } from 'crypto';

import { FormControlAugmentationDirective } from './formcontrol-augmentation.directive';

describe('Directive: FormControlAugmentation', () => {
  const controlValue = randomUUID();

  @Component({
    viewProviders: [FormControlAugmentationDirective],
    template: `<input
      [formControl]="testControl"
      #templateVariableName="formControl"
    />`,
  })
  class TestComponent {
    @ViewChild('templateVariableName')
    exportedFormControl!: FormControlAugmentationDirective;
    testControl = new FormControl(controlValue);
  }

  let spectator;
  let component: TestComponent;

  const createComponent = createComponentFactory({
    component: TestComponent,
    declarations: [FormControlAugmentationDirective],
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
    expect(component.exportedFormControl.host.value).toEqual(controlValue);
  });
});
