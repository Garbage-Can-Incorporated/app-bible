import { TestBed } from '@angular/core/testing';

import { ScripturesService } from './scriptures.service';

describe('ScripturesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ScripturesService = TestBed.get(ScripturesService);
    expect(service).toBeTruthy();
  });
});
