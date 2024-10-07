import { Component, OnInit } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { Router } from '@angular/router';

interface Album {
  title: string;
  artist: string;
  releaseDate: string;
  genre: string;
  cover: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('0.5s ease-in', style({ opacity: 1 })),
      ]),
    ]),
  ],
})
export class HomePage implements OnInit {
  albums: Album[] = [];

  constructor(private router: Router) {}

  ngOnInit() {
    this.loadInitialAlbums();
  }

  ingresar() {
    this.router.navigate(['/login']);
  }

  loadInitialAlbums() {
    for (let i = 0; i < 10; i++) {
      this.albums.push(this.generateRandomAlbum());
    }
  }

  loadMore(event: CustomEvent) {
    setTimeout(() => {
      for (let i = 0; i < 10; i++) {
        this.albums.push(this.generateRandomAlbum());
      }
      if (event.detail && typeof event.detail.complete === 'function') {
        event.detail.complete(); // Finaliza la operación asíncrona
      }
    }, 1000);
  }

  generateRandomAlbum(): Album {
    const randomNumber = Math.floor(Math.random() * 1000);
    return {
      title: `Álbum ${randomNumber}`,
      artist: `Artista ${randomNumber}`,
      releaseDate: `202${randomNumber % 10}`,
      genre: randomNumber % 2 === 0 ? 'Rock' : 'Pop',
      cover: `https://picsum.photos/200/200?random=${randomNumber}`,
    };
  }
}
