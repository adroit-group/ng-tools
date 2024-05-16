import { CdpsComponent } from './cdps.component';
import { createComponentFactory } from '@ngneat/spectator';

describe('CdpsComponent', () => {
  let spectator;
  let component: CdpsComponent;

  const createComponent = createComponentFactory({
    component: CdpsComponent,
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });
});
