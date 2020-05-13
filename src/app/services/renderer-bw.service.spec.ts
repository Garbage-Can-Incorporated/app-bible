import { TestBed } from '@angular/core/testing';

import { RendererBwService } from './renderer-bw.service';

describe('RendererBwService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RendererBwService = TestBed.get(RendererBwService);
    expect(service).toBeTruthy();
  });
});
