import { TestBed, async, inject } from '@angular/core/testing';

import { BasicAuthGuard } from './basic-auth.guard';

describe('BasicAuthGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BasicAuthGuard]
    });
  });

  it('should ...', inject([BasicAuthGuard], (guard: BasicAuthGuard) => {
    expect(guard).toBeTruthy();
  }));
});
