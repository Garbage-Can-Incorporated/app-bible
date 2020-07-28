import { TestBed } from '@angular/core/testing';

import { LastReadService } from './last-read.service';

describe('LastReadService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LastReadService = TestBed.get(LastReadService);
    expect(service).toBeTruthy();
  });
});
