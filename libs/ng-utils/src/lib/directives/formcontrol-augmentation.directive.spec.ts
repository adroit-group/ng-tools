import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { createDirectiveFactory, SpectatorDirective } from '@ngneat/spectator';

import { FormControlAugmentationDirective } from './formcontrol-augmentation.directive';

describe('Directive: FormControlAugmentation', () => {
  let spectator: SpectatorDirective<FormControlAugmentationDirective>;
  let directive: FormControlAugmentationDirective;

  const createDirective = createDirectiveFactory({
    directive: FormControlAugmentationDirective,
    imports: [CommonModule, ReactiveFormsModule],
  });

  beforeEach(() => {
    const testControl = new FormControl(null);

    spectator = createDirective(
      `
        <input [formControl]="control" #templateVariableName="formControl"/>
    `,
      {
        hostProps: {
          control: testControl,
        },
      }
    );

    directive = spectator.directive;
  });

  it('should create', () => {
    expect(directive).toBeDefined();
  });
});
