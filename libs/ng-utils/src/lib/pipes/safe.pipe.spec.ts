/* tslint:disable:no-unused-variable */
import { createPipeFactory, SpectatorPipe } from '@ngneat/spectator';
import { SafePipe } from './safe.pipe';

describe('Pipe: Safe', () => {
  let spectator: SpectatorPipe<SafePipe>;
  const createPipe = createPipeFactory(SafePipe);

  it('should return an instance of SafeHtml.', () => {
    const htmlString = '<a href="https://somelink.com"> Some link </a>';

    spectator = createPipe(`{{ ${htmlString} | safe : 'html' }}`, {});

    expect(spectator.element.innerHTML).toMatch(new RegExp(htmlString, 'gi'));
  });
});
