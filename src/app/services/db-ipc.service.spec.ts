import { TestBed } from '@angular/core/testing';

import { DbIpcService } from './db-ipc.service';

describe('DbIpcService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DbIpcService = TestBed.get(DbIpcService);
    expect(service).toBeTruthy();
  });
});
