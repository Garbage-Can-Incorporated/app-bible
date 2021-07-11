import { TestBed } from '@angular/core/testing';

import { LastReadService } from './last-read.service';

describe('LastReadService', () => {
  let service: LastReadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LastReadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
