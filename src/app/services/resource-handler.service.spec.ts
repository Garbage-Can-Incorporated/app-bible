import { TestBed } from '@angular/core/testing';

import { ResourceHandlerService } from './resource-handler.service';

describe('ResourceHandlerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ResourceHandlerService = TestBed.get(ResourceHandlerService);
    expect(service).toBeTruthy();
  });
});
