/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { BusinessLogicExecutorService } from './business-logic-executor.service';

describe('Service: BusinessLogicExecutor', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BusinessLogicExecutorService]
    });
  });

  it('should ...', inject([BusinessLogicExecutorService], (service: BusinessLogicExecutorService) => {
    expect(service).toBeTruthy();
  }));
});
