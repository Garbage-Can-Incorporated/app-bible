import { TestBed } from '@angular/core/testing';

import { ScriptureNavigationService } from './scripture-navigation.service';

describe('ScriptureNavigationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ScriptureNavigationService = TestBed.get(ScriptureNavigationService);
    expect(service).toBeTruthy();
  });
});
