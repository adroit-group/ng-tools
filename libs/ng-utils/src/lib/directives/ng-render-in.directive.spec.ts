/* tslint:disable:no-unused-variable */

import { CommonModule } from '@angular/common';
import { createDirectiveFactory, SpectatorDirective } from '@ngneat/spectator';
import { NgRenderInDirective } from './ng-render-in.directive';

describe('Directive: NgRenderIn', () => {
  let spectator: SpectatorDirective<NgRenderInDirective>;
  let directive: NgRenderInDirective;
  let hostEl: HTMLDivElement;

  const createDirective = createDirectiveFactory({
    directive: NgRenderInDirective,
    imports: [CommonModule],
  });

  describe('simple case', () => {
    beforeEach(() => {
      spectator = createDirective(
        `<div *ngRenderIn="'browser'" #container>
          <div #content></div>
        </div>`
      );

      directive = spectator.directive;
      hostEl = spectator.query('#container') as HTMLDivElement;
    });

    it('should create', () => {
      expect(directive).toBeDefined();
    });

    it('Should NOT render the host element because the test is run in nodeJs server context.', () => {
      expect(hostEl).toBeFalsy();
    });
  });

  describe('Alternate template', () => {
    beforeEach(() => {
      spectator = createDirective(
        `<div *ngRenderIn="'browser'; or serverTpl" #container>
          <div #content></div>
        </div>

        <ng-template #serverTpl>
          <div #serverContainer></div>
        </ng-template>`
      );

      directive = spectator.directive;
    });

    it('should render serverTpl', () => {
      const serverTpl = spectator.query('#serverTpl');
      const browserTpl = spectator.query('container');

      expect(browserTpl).toBeFalsy();
      expect(serverTpl).toBeDefined();
    });
  });

  afterEach(() => {
    directive?.ngOnDestroy();
  });
});
