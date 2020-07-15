import { TestBed } from '@angular/core/testing';

import { MainMapService } from './main-map.service';

describe('MainMapService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MainMapService = TestBed.get(MainMapService);
    expect(service).toBeTruthy();
  });
});
