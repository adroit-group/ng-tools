/* tslint:disable:no-unused-variable */
import { CommonModule } from '@angular/common';
import { createDirectiveFactory, SpectatorDirective } from '@ngneat/spectator';
import {
  NgRenderInBrowserDirective,
  NgRenderInDirective,
  NgRenderInServerDirective,
} from './ng-render-in.directive';

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

describe('Directive: NgRenderInBrowserDirective', () => {
  let spectator: SpectatorDirective<NgRenderInBrowserDirective>;

  const createDirective = createDirectiveFactory({
    directive: NgRenderInBrowserDirective,
    imports: [CommonModule],
  });

  beforeEach(() => {
    spectator = createDirective(
      `<div *ngRenderInBrowser="or serverTpl" #container>
          <div #content></div>
        </div>

        <ng-template #serverTpl>
          <div #serverContainer></div>
        </ng-template>`
    );
  });

  it('should render serverTpl', () => {
    const serverTpl = spectator.query('#serverTpl');
    const browserTpl = spectator.query('container');

    expect(browserTpl).toBeFalsy();
    expect(serverTpl).toBeDefined();
  });
});

describe('NgRenderInServerDirective', () => {
  let spectator: SpectatorDirective<NgRenderInServerDirective>;

  const createDirective = createDirectiveFactory({
    directive: NgRenderInServerDirective,
    imports: [CommonModule],
  });

  beforeEach(() => {
    spectator = createDirective(
      `<div *ngRenderInServer #container>
          <div #content></div>
        </div>`
    );
  });

  it('should render serverTpl', () => {
    const serverTpl = spectator.query('container');

    expect(serverTpl).toBeDefined();
  });
});
