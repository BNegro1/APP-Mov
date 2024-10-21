import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SpotifyAuthService } from './spotify-auth.service';
import { map, catchError } from 'rxjs/operators';

export interface Album { // Interface para el álbum
  id: string;
  title: string;
  artist: string;
  releaseDate: string;
  genre: string;
  cover: string;
  liked?: boolean; 
  disliked?: boolean; 
}

@Injectable({
  providedIn: 'root',
})

export class SpotifyAlbumService {
  private spotifyApiUrl = 'https://api.spotify.com/v1';

  constructor(
    private http: HttpClient,
    private authService: SpotifyAuthService
  ) {}

  searchAlbums(
    query: string,
    limit: number,
    offset: number
  ): Observable<Album[]> {
    return new Observable((observer) => {
      this.authService.getAccessToken().then((token) => {
        const headers = new HttpHeaders({
          Authorization: `Bearer ${token}`,
        });

        this.http
          .get(
            `${this.spotifyApiUrl}/search?type=album&q=${encodeURIComponent(
              query
            )}&limit=${limit}&offset=${offset}`,
            { headers }
          )
          .pipe(
            map((response: any) =>
              this.processAlbumSearch(response.albums.items)
            ),
            catchError((error) => {
              console.error('Error searching albums:', error);
              observer.error(error);
              return [];
            })
          )
          .subscribe((albums) => {
            observer.next(albums);
            observer.complete();
          });
      });
    });
  }

  // Procesar respuesta de la api de spotify para  agregarla a Interface 
  private processAlbumSearch(albums: any[]): Album[] {
    return albums.map((album) => ({ 
      id: album.id,
      title: album.name,
      artist: album.artists[0].name,
      releaseDate: album.release_date,
      genre: 'Unknown', // La API NO INCLUYE GENERO, PERO VERIFICAR MÁS ADELANTE
      cover: album.images[0]?.url || 'https://via.placeholder.com/300',
    }));
  }
}
