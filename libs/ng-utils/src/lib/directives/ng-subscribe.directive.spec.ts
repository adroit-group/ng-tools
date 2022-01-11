import { CommonModule } from '@angular/common';
import { fakeAsync } from '@angular/core/testing';
import { createDirectiveFactory, SpectatorDirective } from '@ngneat/spectator';
import { BehaviorSubject } from 'rxjs';
import { NgSubscribeDirective } from './ng-subscribe.directive';

describe('Directive: NgLet', () => {
  let spectator: SpectatorDirective<NgSubscribeDirective<any>>;
  let directive: NgSubscribeDirective<any>;
  let stringStream$: BehaviorSubject<string>;
  let numberStream$: BehaviorSubject<number>;
  let hostEl: HTMLDivElement;

  const createDirective = createDirectiveFactory({
    directive: NgSubscribeDirective,
    imports: [CommonModule],
  });

  beforeEach(() => {
    stringStream$ = new BehaviorSubject('John');
    numberStream$ = new BehaviorSubject(20);
  });

  describe('simple case', () => {
    beforeEach(() => {
      spectator = createDirective(
        `
                <div *ngSubscribe="stringStream$ as name">
                    {{ name }}
                </div>`,
        {
          hostProps: {
            stringStream$,
            numberStream$,
          },
        }
      );

      directive = spectator.directive;
      hostEl = spectator.query('div') as HTMLDivElement;
    });

    it('should create', () => {
      expect(directive).toBeDefined();
    });

    it('Should subscribe to the provided stream and update the template context variable with its values', fakeAsync(() => {
      expect(hostEl.textContent?.includes('John')).toBeTruthy();
      stringStream$.next('Adam');
      spectator.tick();
      expect(hostEl.textContent?.includes('Adam')).toBeTruthy();
    }));
  });

  describe('object notation case', () => {
    beforeEach(() => {
      spectator = createDirective(
        `
                <div *ngSubscribe="{ name: stringStream$, age: numberStream$ } as context">
                    {{ context.name + ' ' + context.age }}
                </div>`,
        {
          hostProps: {
            stringStream$,
            numberStream$,
          },
        }
      );

      directive = spectator.directive;
      hostEl = spectator.query('div') as HTMLDivElement;
    });

    it('should create', () => {
      expect(directive).toBeDefined();
    });
  });

  describe('array notation case', () => {
    beforeEach(() => {
      spectator = createDirective(
        `
                <div *ngSubscribe="[stringStream$, numberStream$] as context">
                    {{ context[0] + ' ' + context[1] }}
                </div>`,
        {
          hostProps: {
            stringStream$,
            numberStream$,
          },
        }
      );

      directive = spectator.directive;
      hostEl = spectator.query('div') as HTMLDivElement;
    });

    it('should create', () => {
      expect(directive).toBeDefined();
    });
  });

  afterEach(() => {
    directive?.ngOnDestroy();
  });
});
