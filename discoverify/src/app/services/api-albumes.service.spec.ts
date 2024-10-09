import { TestBed } from '@angular/core/testing';

import { ApiAlbumesService } from './api-albumes.service';

describe('ApiAlbumesService', () => {
  let service: ApiAlbumesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiAlbumesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
