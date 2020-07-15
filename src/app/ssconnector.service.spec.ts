import { TestBed } from '@angular/core/testing';

import { SsconnectorService } from './ssconnector.service';

describe('SsconnectorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SsconnectorService = TestBed.get(SsconnectorService);
    expect(service).toBeTruthy();
  });
});
