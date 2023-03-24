/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @angular-eslint/component-selector */
/* tslint:disable:no-unused-variable */
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { createDirectiveFactory, SpectatorDirective } from '@ngneat/spectator';
import {
  NgComponentOutletAugmentationDirective,
  NgComponentOutletEvent,
} from './ng-component-outlet-augmentation.directive';

@Component({
  selector: 'app-test',
  template: `
    <button id="test-btn" (click)="testEvent.emit(testData.id)">{{ testData?.id }}</button>`,
})
export class TestComponent {
  @Input() public testData!: { id: string };

  @Output() public readonly testEvent = new EventEmitter<string>();
}

describe('Directive: NgComponentOutletAugmentation', () => {
  let spectator: SpectatorDirective<NgComponentOutletAugmentationDirective>;

  const createDirective = createDirectiveFactory({
    directive: NgComponentOutletAugmentationDirective,
    declarations: [TestComponent],
    imports: [CommonModule],
  });

  it('should create and bind inputs', () => {
    spectator = createDirective(
      `
        <ng-container *ngComponentOutlet="testComponent; inputs: { testData: testData }">
        </ng-container>
      `,
      {
        hostProps: {
          testData: {
            id: 'test',
          },
          testComponent: TestComponent,
        },
      }
    );

    const component = spectator.query(TestComponent);
    expect(component).toBeDefined();

    expect(spectator.directive).toBeDefined();
    expect(spectator.directive.inputs).toEqual({ testData: { id: 'test' } });

    const testCompButton = spectator.query('button#test-btn');
    expect(testCompButton).toBeDefined();
    expect(testCompButton?.innerHTML).toContain('test');
  });

  it('should create and bind outputs', () => {
    const compEventHandler = (event: NgComponentOutletEvent) => {
      expect(event?.key).toEqual('testEvent');
      expect(event?.event).toEqual('test');
    };

    const mockFnContainer = { fn: compEventHandler };

    jest.spyOn(mockFnContainer, 'fn');

    spectator = createDirective(
      `
        <ng-template
          [ngComponentOutlet]="testComponent"
          [ngComponentOutletInputs]="{ testData: testData }"
          (ngComponentOutletOutputs)="compEventHandler($event)">
        </ng-template>
      `,
      {
        hostProps: {
          compEventHandler: mockFnContainer.fn,
          testData: {
            id: 'test',
          },
          testComponent: TestComponent,
        },
      }
    );

    const component = spectator.query(TestComponent);
    expect(component).toBeDefined();

    expect(spectator.directive).toBeDefined();

    const testCompButton = spectator.query('button#test-btn');
    expect(testCompButton).toBeDefined();

    spectator.click(testCompButton!);

    expect(mockFnContainer.fn).toHaveBeenCalledWith({
      key: 'testEvent',
      event: 'test',
    });
  });
});
