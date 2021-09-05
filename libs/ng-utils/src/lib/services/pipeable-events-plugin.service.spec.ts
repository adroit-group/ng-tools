/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PipeableEventsManagerService } from './pipeable-events-manager.service';

describe('Service: PipeableEventsManager', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PipeableEventsManagerService]
    });
  });

  it('should ...', inject([PipeableEventsManagerService], (service: PipeableEventsManagerService) => {
    expect(service).toBeTruthy();
  }));
});
