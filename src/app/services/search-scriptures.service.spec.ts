import { TestBed } from '@angular/core/testing';

import { SearchScripturesService } from './search-scriptures.service';

describe('SearchScripturesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SearchScripturesService = TestBed.get(SearchScripturesService);
    expect(service).toBeTruthy();
  });
});
