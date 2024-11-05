import { Component, OnInit } from '@angular/core';
import { FirebaseLoginService } from 'src/app/services/firebase/firebase-ser.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  nombreUsuario: string = '';
  email: string = '';
  likesCount: number = 0;
  isAuthenticated: boolean = false;
  userAlbums: { title: string; artist: string; cover: string }[] = []; // Almacenar álbumes del usuario
  constructor(
    private firebaseLoginService: FirebaseLoginService,
    private router: Router,
  ) { }

  async ngOnInit() {
    // Obtener datos del usuario actual
    const userData = await this.firebaseLoginService.getUserData();
    if (userData) {
      console.log('UID del usuario:', userData.uid); // Verificar el UID
      this.nombreUsuario = userData.usuario;
      this.email = userData.email;
      this.likesCount = userData.likesCount || 0;

      // Obtener álbumes contribuidos del usuario
      this.userAlbums = await this.firebaseLoginService.getUserAlbums(userData.uid);
      console.log('Álbumes contribuidos:', this.userAlbums); // Verificar los álbumes obtenidos
    }
  }
}
