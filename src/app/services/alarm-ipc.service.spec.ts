import { TestBed } from '@angular/core/testing';

import { AlarmIpcService } from './alarm-ipc.service';

describe('AlarmIpcService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AlarmIpcService = TestBed.get(AlarmIpcService);
    expect(service).toBeTruthy();
  });
});
