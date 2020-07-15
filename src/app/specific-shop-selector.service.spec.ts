import { TestBed } from '@angular/core/testing';

import { SpecificShopSelectorService } from './specific-shop-selector.service';

describe('SpecificShopSelectorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SpecificShopSelectorService = TestBed.get(SpecificShopSelectorService);
    expect(service).toBeTruthy();
  });
});
