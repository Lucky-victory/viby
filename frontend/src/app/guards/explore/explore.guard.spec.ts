import { TestBed } from '@angular/core/testing';

import { ExploreGuard } from './explore.guard';

describe('ExploreGuard', () => {
  let guard: ExploreGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ExploreGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
