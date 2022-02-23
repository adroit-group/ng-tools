/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { createDirectiveFactory, SpectatorDirective } from '@ngneat/spectator';

import { NgLetDirective } from './ng-let.directive';

describe('Directive: NgLet', () => {
  let spectator: SpectatorDirective<NgLetDirective<any>>;
  const createDirective = createDirectiveFactory({
    directive: NgLetDirective,
    imports: [CommonModule],
  });

  it('should create an instance', () => {
    spectator = createDirective(`<div *ngLet="1 as num"></div>`);
    expect(spectator.query(NgLetDirective)).toBeDefined();
  });

  it('Should have the template context variable available under the name specified in the as clause', () => {
    spectator = createDirective(`<div *ngLet="1 as num">{{num}}</div>`);
    expect(spectator.query('div')?.textContent).toBe('1');
  });

  it('Should update the template context variables value without rerendering when it changes', () => {
    spectator = createDirective(
      `<div *ngLet="context.name as name">{{name}}</div>`,
      {
        hostProps: {
          context: {
            name: 'John',
          },
        },
      }
    );

    expect(spectator.query('div')?.textContent).toBe('John');

    spectator.setHostInput({
      context: {
        name: 'Adam',
      },
    });

    expect(spectator.query('div')?.textContent).toBe('Adam');
  });

  it('Should make the template context variables available when using the object notation form', () => {
    spectator = createDirective(`
            <div *ngLet="{ name: 'John', age: 20 } as context">
                {{context.name + ' ' + context.age}}
            </div>
        `);
    expect(
      spectator.query('div')?.textContent?.includes('John 20')
    ).toBeTruthy();
  });

  it('Should make the template context variables available when using the array notation form', () => {
    spectator = createDirective(
      `
            <div *ngLet="[name, age] as context">
                {{context[0] + ' ' + context[1]}}
            </div>
        `,
      {
        hostProps: {
          name: 'John',
          age: 20,
        },
      }
    );

    expect(
      spectator.query('div')?.textContent?.includes('John 20')
    ).toBeDefined();
  });
});
