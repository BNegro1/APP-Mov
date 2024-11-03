import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { SpotifyAlbumService, Album } from '../../services/spotify-api/spotify-album.service'; // Importar SpotifyAlbumService
import { FirebaseLoginService } from 'src/app/services/firebase/firebase-ser.service'; // Importar FirebaseLoginService
import { Router } from '@angular/router'; // Importar Router
import { AngularFirestore } from '@angular/fire/compat/firestore'; // Importar AngularFirestore

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})

export class HomePage implements OnInit {
  @ViewChild('content', { static: false }) content!: IonContent; // Referencia -> 'content' 
                                                                 // (Esta se encarga de manejar el contenido de la página)

  albums: Album[] = [];
  loading = false;
  error = '';
  limit = 10;
  offset = 0;
  isAuthenticated: boolean = false; // Definir isAuthenticated como booleano, sino se asigna un valor, se asume que es "undefined".
  nombreUsuario: string | null = ''; // Definir nombreUsuario como string o null para evitar errores, se usa "/" para indicar que puede ser null o string.
  likesCount: number = 0; // Variable para contar los likes (Definida con 0.)


  // Se utiliza SpotifyAlbumService, FirebaseLoginService, AngularFirestore y Router.
  // Spotify es la API de Spotify -> Check: Implementada :) !!!
  constructor(
    private spotifyAlbumService: SpotifyAlbumService,
    private firebaseLoginService: FirebaseLoginService, // Inyectar FirebaseLoginService
    private firestore: AngularFirestore, // Inyectar AngularFirestore
    private router: Router // Inyectar Router
  ) { }

  async ngOnInit() {
    this.isAuthenticated = await this.firebaseLoginService.isAuthenticated(); // Esperar el resultado

    const userData = await this.firebaseLoginService.getUserData(); // Obtener datos del usuario
    if (userData) {
      this.nombreUsuario = userData.usuario; // Asignar el nombre de usuario
      this.likesCount = await this.firebaseLoginService.getUserLikesCount(userData.uid);
    }

    if (this.isAuthenticated) {
      this.loadAlbums();
    } else {
      this.router.navigate(['/login']); // Redirigir a la página de login si no está autenticado
    }
  }

  loadAlbums() {
    this.loading = true;
    this.spotifyAlbumService 
      // Acontinuación, se llama al método searchAlbums del servicio SpotifyAlbumService
      // Esto sirve para buscar álbumes de los artistas especificados en la cadena de texto.
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
    const userData = await this.firebaseLoginService.getUserData();
    if (userData) {
      // Verificar likes para cada álbum
      for (const album of this.albums) {
        album.liked = await this.firebaseLoginService.hasUserLikedAlbum(album.id, userData.uid);
      }
    }
  }

  loadMore(event: any) {
    this.offset += this.limit;

    this.spotifyAlbumService
      .searchAlbums('Joy Division, New Order, The Police', this.limit, this.offset)
      .subscribe( // SUbscribirse al observable para obtener los álbumes
        (albums) => {
          this.albums = [...this.albums, ...albums]; // Concatenar los nuevos álbumes.. (Usar spread operator) 
                                                     // (Spread operator = ..., hacen que los elementos de un array se expandan)
          event.target.complete();

          if (albums.length === 0) {
            event.target.disabled = true;
          }
        },
        (error) => {
          console.error('Error realizando el fecth de albumes:', error);
          event.target.complete();
        }
      );
  }

  async likeAlbum(albumId: string) {
    const userData = await this.firebaseLoginService.getUserData(); // Obtener datos del usuario mediante FirebaseLoginService
    if (userData) {
      const album = this.albums.find(a => a.id === albumId); // Si el álbum existe en la lista de álbumes
      if (album && !album.liked) {
        const success = await this.firebaseLoginService.addLike(albumId, userData.uid);
        if (success) {
          album.liked = true;
          album.disliked = false;
          this.likesCount = await this.firebaseLoginService.getUserLikesCount(userData.uid);
        }
      }
    }
  }

  async dislikeAlbum(albumId: string) { // Método para "dislike" un álbum (async/await y promesas).
    const userData = await this.firebaseLoginService.getUserData();
    if (userData) {
      const album = this.albums.find(a => a.id === albumId); // Buscar el álbum en la lista de álbumes (si existe)
      if (album && album.liked) { 
        const success = await this.firebaseLoginService.removeLike(albumId, userData.uid);
        if (success) {
          album.liked = false;
          album.disliked = true;
          this.likesCount = await this.firebaseLoginService.getUserLikesCount(userData.uid);
        }
      }
    }
  }

  scrollToTop() {
    this.content.scrollToTop(550); // Scrollear hacia arriba (Back to top)
  }

  logout() {
    this.firebaseLoginService.logout(); // Utilizar FirebaseLoginService para logout
    this.router.navigate(['/login']);
  }
}
