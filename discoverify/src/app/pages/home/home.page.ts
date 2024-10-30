import { Component, OnInit } from '@angular/core';
import { SpotifyAlbumService } from '../../services/spotify-album.service';
import { Album } from '../../services/spotify-album.service';
import { AuthService } from 'src/app/services/auth.service'; // Importar AuthService
import { Router } from '@angular/router'; // Importar Router
import { DbService } from 'src/app/services/dbservice.service'; // Importar DbService para interactuar con la base de datos de likes

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
  likesCount: number = 0; // Variable para contar los likes (Definida con 0.)

  constructor(
    private dbService: Dbervice, // Inyectar DbService para manejar localStorage.
    private spotifyAlbumService: SpotifyAlbumService,
    private authService: AuthService, // Inyectar AuthService
    private router: Router // Inyectar Router
  ) { }

  async ngOnInit() {
    this.isAuthenticated = this.authService.isAuthenticated();
    this.nombreUsuario = await this.authService.getNombreUsuario(); // Esperar el nombre de usuario

    if (this.isAuthenticated) {
      this.loadAlbums();
    } else {
      this.router.navigate(['/login']); // Redirigir a la página de login si no está autenticado
    }

    // Hacer subscribe al contador de likes
    this.dbService.getLikesCount().subscribe((count) => {
      this.likesCount = count; // Actualizar el contador de likes en el navbar
    });
  }

  loadAlbums() {
    this.loading = true;
    this.spotifyAlbumService
      .searchAlbums('New Order, Oasis, The Cure, Bauhaus, Depeche Mode', this.limit, this.offset)
      .subscribe(
        (albums) => {
          this.albums = albums;
          this.loading = false;
          this.checkAlbumLikes(); // Verificar si los álbumes ya tienen "like" o "dislike"
        },
        (error) => {
          console.error('Error de fetching, error desc.:', error);
          this.error = 'No se puede cargar albumes, zzz...';
          this.loading = false;
        }
      );
  }

  async checkAlbumLikes() {
    const userId = await this.authService.getNombreUsuario(); // Esperar el userId
    if (userId) { // Verificar que userId no sea null
      const likedAlbums = await this.dbService.getLikedAlbums(userId); // Esperar a que se resuelva la promesa

      this.albums.forEach(album => {
        album.liked = likedAlbums.includes(album.id); // Verificar si el álbum tiene "like"
      });
    }
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

  async likeAlbum(albumId: string) {
    const userId = await this.authService.getNombreUsuario(); // Esperar el userId
    if (userId) { // Verificar que userId no sea null
      const album = this.albums.find(a => a.id === albumId);
      if (album) {
        album.liked = true;
        album.disliked = false;
        await this.dbService.likeAlbum(userId, albumId); // Guardar en SQLite
        this.updateRecommendations(album);
      }
    }
  }

  async dislikeAlbum(albumId: string) {
    const userId = await this.authService.getNombreUsuario(); // Esperar el userId
    if (userId) { // Verificar que userId no sea null
      const album = this.albums.find(a => a.id === albumId);
      if (album) {
        album.liked = false;
        album.disliked = true;
        await this.dbService.dislikeAlbum(userId, albumId); // Guardar en SQLite
        this.updateRecommendations(album);
      }
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  // Simular la actualización de recomendaciones
  updateRecommendations(album: Album) {
    if (album.liked) {
      console.log(`Recomendaciones actualizadas basadas en que te gusta el álbum: ${album.title}`);
    } else if (album.disliked) {
      console.log(`No se mostrarán álbumes similares a: ${album.title}`);
    }
  }
}
