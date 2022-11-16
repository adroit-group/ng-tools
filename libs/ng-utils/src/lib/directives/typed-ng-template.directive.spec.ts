/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { createDirectiveFactory, SpectatorDirective } from '@ngneat/spectator';
import { TypedNgTemplateDirective } from './typed-ng-template.directive';

describe('Directive: NgLet', () => {
  let spectator: SpectatorDirective<TypedNgTemplateDirective<any>>;
  let directive: TypedNgTemplateDirective<any>;

  const createDirective = createDirectiveFactory({
    directive: TypedNgTemplateDirective,
    imports: [CommonModule],
  });

  beforeEach(() => {
    spectator = createDirective(
      `<ng-template #testTpl typedNgTemplate="any"></ng-template>`
    );
    directive = spectator.directive;
  });

  it('should create', () => {
    expect(directive).toBeDefined();
  });
});
