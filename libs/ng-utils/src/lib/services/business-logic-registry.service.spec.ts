/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { BusinessLogicRegistryService } from './business-logic-registry.service';

describe('Service: BusinessLogicRegistry', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BusinessLogicRegistryService]
    });
  });

  it('should ...', inject([BusinessLogicRegistryService], (service: BusinessLogicRegistryService) => {
    expect(service).toBeTruthy();
  }));
});
