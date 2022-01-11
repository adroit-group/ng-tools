/* tslint:disable:no-unused-variable */
import { CommonModule } from '@angular/common';
import { createDirectiveFactory, SpectatorDirective } from '@ngneat/spectator';

import { NgForAugmentationDirective } from './ng-for-augmentation.directive';

describe('Directive: NgForAugmentation', () => {
  let spectator: SpectatorDirective<NgForAugmentationDirective<unknown>>;

  const createDirective = createDirectiveFactory({
    directive: NgForAugmentationDirective,
    imports: [CommonModule],
  });

  it('should create', () => {
    spectator = createDirective(
      `
        <div *ngFor="let item of list empty blankTpl">{{ item }}</div>

        <ng-template #blankTpl>
          <div id="emptyListContainer"></div>
        </ng-template>
      `,
      {
        hostProps: {
          list: [0, 1, 2],
        },
      }
    );

    expect(spectator.directive).toBeDefined();
  });

  it('Should render the else template when ngFor receives a non array value.', () => {
    spectator = createDirective(
      `<div *ngFor="let item of list else noListTpl" #container>
            {{ item }}
          </div>

          <ng-template #noListTpl>
            <div id="noListContainer"></div>
          </ng-template>
          `,
      {
        hostProps: {
          list: undefined,
        },
      }
    );

    const noListContainer = spectator.query('#noListContainer');
    expect(noListContainer).toBeDefined();
  });

  it('Should render the empty list template when ngFor receives an array with length 0.', () => {
    spectator = createDirective(
      `<div *ngFor="let item of list empty emptyListTpl" #container>
            {{ item }}
          </div>

          <ng-template #emptyListTpl>
            <div id="emptyListContainer"></div>
          </ng-template>
          `,
      {
        hostProps: {
          list: [],
        },
      }
    );

    const emptyListContainer = spectator.query('#emptyListContainer');
    expect(emptyListContainer).toBeDefined();
  });
});
