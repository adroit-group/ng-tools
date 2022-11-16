import { CommonModule } from "@angular/common";
import { SpectatorDirective, createDirectiveFactory } from "@ngneat/spectator";
import { NgForTrackIdDirective } from "./ng-for-track-id.directive";


/* tslint:disable:no-unused-variable */
describe('Directive: NgLet', () => {
  let spectator: SpectatorDirective<NgForTrackIdDirective>;
  let directive: NgForTrackIdDirective;

  const createDirective = createDirectiveFactory({
    directive: NgForTrackIdDirective,
    imports: [CommonModule],
  });

  beforeEach(() => {
    spectator = createDirective(`<div *ngFor="let item of list"></div>`, {
      hostProps: {
        list: [0, 1, 2],
      },
    });
    directive = spectator.directive;
  });

  it('should create', () => {
    expect(directive).toBeDefined();
  });
});
