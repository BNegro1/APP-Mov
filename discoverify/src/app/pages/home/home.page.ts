import { Component, OnInit } from '@angular/core';
import { SpotifyAlbumService } from '../../services/spotify-album.service';
import { Album } from '../../services/spotify-album.service'; // Importacion de la interface

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})

export class HomePage implements OnInit {
  albums: Album[] = []; // Declaramos array de albumes
  loading = false;
  error = '';
  limit = 10; // Limite de requests
  offset = 0; 

  constructor(private spotifyAlbumService: SpotifyAlbumService) {}

  ngOnInit() {
    this.loadAlbums();
  }

  // Carga inciial de album
  loadAlbums() {
    this.loading = true;
    this.spotifyAlbumService
      .searchAlbums('radiohead', this.limit, this.offset)
      .subscribe(
        (albums) => {
          this.albums = albums;
          this.loading = false;
        },
        (error) => {
          console.error('Error de fetching, error desc.:', error);
          this.error = 'No se puede cargar albumes, zzz...';
          this.loading = false;
        }
      );
  }


  loadMore(event: any) {
    this.offset += this.limit; // Incremento de offset mediadamente se scrollea

    this.spotifyAlbumService
      .searchAlbums('radiohead', this.limit, this.offset)
      .subscribe(
        (albums) => {
          this.albums = [...this.albums, ...albums]; // Agregar albumes al array 
          event.target.complete(); //Notificación de carga

          // En caso de no entregar mas albumes, desactivamos el scroll.
          if (albums.length === 0) {
            event.target.disabled = true;
          }
        },
        (error) => {
          console.error('ERROR AL FETCHING DE ALBUMES XD:', error);
          event.target.complete(); // En caso de error, no carga la animación de carga.
        }
      );
  }
}
