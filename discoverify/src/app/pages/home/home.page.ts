import { Component, OnInit } from '@angular/core';
import { SpotifyAlbumService } from '../../services/spotify-album.service';
import { Album } from '../../services/spotify-album.service';
import { AuthService } from 'src/app/services/auth.service'; // Importar AuthService
import { Router } from '@angular/router'; // Importar Router

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  albums: Album[] = [];
  loading = false;
  error = '';
  limit = 10;
  offset = 0;
  isAuthenticated: boolean = false;
  nombreUsuario: string | null = ''; // Definir nombreUsuario como string o null para evitar errores, se usa "/" para indicar que puede ser null o string.

  constructor(
    private spotifyAlbumService: SpotifyAlbumService,
    private authService: AuthService, // Inyectar AuthService
    private router: Router // Inyectar Router
  ) { }

  ngOnInit() {
    this.isAuthenticated = this.authService.isAuthenticated();
    this.nombreUsuario = this.authService.getNombreUsuario();

    if (this.isAuthenticated) {
      this.loadAlbums();
    } else {
      this.router.navigate(['/login']); // Redirigir a la página de login si no está autenticado
    }
  }

  loadAlbums() {
    this.loading = true;
    this.spotifyAlbumService
      .searchAlbums('New Order, Oasis, The Cure, Bauhaus, Depeche Mode', this.limit, this.offset)
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
    this.offset += this.limit;

    this.spotifyAlbumService
      .searchAlbums('Joy Division, New Order, The Police', this.limit, this.offset)
      .subscribe(
        (albums) => {
          this.albums = [...this.albums, ...albums];
          event.target.complete();

          if (albums.length === 0) {
            event.target.disabled = true;
          }
        },
        (error) => {
          console.error('ERROR AL FETCHING DE ALBUMES XD:', error);
          event.target.complete();
        }
      );
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
