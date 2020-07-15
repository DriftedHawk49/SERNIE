import { TestBed } from '@angular/core/testing';

import { RequestSegregationService } from './request-segregation.service';

describe('RequestSegregationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RequestSegregationService = TestBed.get(RequestSegregationService);
    expect(service).toBeTruthy();
  });
});
