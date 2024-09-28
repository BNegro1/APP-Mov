import { Component, OnInit } from '@angular/core'; // Importación de Angular animations.
import { trigger, transition, style, animate } from '@angular/animations';

// Interfaz Album para definir la estructura de un álbum, PULIR MÁS!!!.
interface Album { 
  title: string; // Título del álbum
  artist: string; // Artista del álbum
  releaseDate: string; // Fecha de lanzamiento del álbum
  genre: string; // Género del álbum
  cover: string; // URL de la portada del álbum
}


@Component({
  selector: 'app-home', 
  templateUrl: './home.page.html', 
  styleUrls: ['./home.page.scss'],
  animations: [
    // Definición de animaciones
    trigger('fadeIn', [
      // Trigger de fadeIn
      transition(':enter', [
        style({ opacity: 0 }), // Opacidad 0
        animate('0.5s ease-in', style({ opacity: 1 })), // Opacidad a 1 en 0.5 segundos
      ]),
    ]),
  ],
})
export class HomePage implements OnInit {
  albums: Album[] = []; // ALMACENAMIENTO DE ALBUMES!!!

  constructor() {}

  ngOnInit() {
    this.loadInitialAlbums(); // Carga los álbumes iniciales al iniciar el componente
  }

  // Método para cargar los álbumes iniciales
  loadInitialAlbums() {
    for (let i = 0; i < 10; i++) {
      this.albums.push(this.generateRandomAlbum()); // Añade 10 albumes aleatoriamente desde el array.
    }
  }

  loadMore(event: CustomEvent) { // Método para cargar más álbumes al hacer scroll
    setTimeout(() => {
      for (let i = 0; i < 10; i++) {
        this.albums.push(this.generateRandomAlbum()); // De igual forma, añade 10 albumes aleatoriamente desde el array.
      }
      event.detail.complete(); // Indica que la carga ha terminado
    }, 1000);
  }

  // Método para generar un álbum aleatorio
  generateRandomAlbum(): Album {
    const randomNumber = Math.floor(Math.random() * 1000); // Genera un número aleatorio entre 0 y 999 (SOLO PARA TESTEO!!!)
    return {
      title: `Álbum ${randomNumber}`, // Título del álbum
      artist: `Artista ${randomNumber}`, // Artista del álbum
      releaseDate: `202${randomNumber % 10}`, // Fecha de lanzamiento
      genre: randomNumber % 2 === 0 ? 'Rock' : 'Pop', // Género del álbum
      cover: `https://picsum.photos/200/200?random=${randomNumber}`, // URL de la portada del álbum
    };
  }
}
