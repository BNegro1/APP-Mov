import { TestBed } from '@angular/core/testing';

import { SpotifyAlbumService } from './spotify-album.service';

describe('SpotifyAlbumService', () => {
  let service: SpotifyAlbumService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpotifyAlbumService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
