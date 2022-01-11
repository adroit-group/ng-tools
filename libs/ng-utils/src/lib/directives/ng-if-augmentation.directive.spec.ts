/* tslint:disable:no-unused-variable */
import { CommonModule } from '@angular/common';
import { createDirectiveFactory, SpectatorDirective } from '@ngneat/spectator';

import { NgIfAugmentedDirective } from './ng-if-augmentation.directive';

describe('Directive: NgRenderIn', () => {
  let spectator: SpectatorDirective<NgIfAugmentedDirective<unknown>>;

  const createDirective = createDirectiveFactory({
    directive: NgIfAugmentedDirective,
    imports: [CommonModule],
  });

  it('should create', () => {
    spectator = createDirective(
      `
        <div *ngIf="false or loading">
          Conditional template
        </div>

        <ng-template #loading>
          <div id="loadingTemplate"></div>
        </ng-template>
      `
    );

    expect(spectator.directive).toBeDefined();
  });

  it('Should render the else template when ngFor receives a non array value.', () => {
    spectator = createDirective(
      `
        <div *ngIf="false or loading">
          Conditional template
        </div>

        <ng-template #loading>
          <div id="loadingTemplate"></div>
        </ng-template>
      `
    );

    const loadingTemplate = spectator.query('#loading');
    expect(loadingTemplate).toBeDefined();
  });

  it('Should render the empty list template when ngFor receives an array with length 0.', () => {
    spectator = createDirective(
      `
        <div *ngIf="conditional but error">
          Conditional template
        </div>

        <ng-template #error>
          <div id="errorTemplate"></div>
        </ng-template>
      `,
      {
        hostProps: {
          conditional: new Error(),
        },
      }
    );

    const errorTemplate = spectator.query('#errorTemplate');
    expect(errorTemplate).toBeDefined();
  });
});
