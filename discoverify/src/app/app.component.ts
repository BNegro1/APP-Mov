import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseLoginService } from './services/firebase/firebase-ser.service';
import { Platform } from '@ionic/angular';
import { StorageService } from './services/storage/storage.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  showSplash = true;
  isAuthenticated = false;
  nombreUsuario: string | null = '';
  likesCount: number = 0;

  constructor(
    private router: Router,
    private platform: Platform,
    private authService: FirebaseLoginService,
    private storageService: StorageService  // Inyectar StorageService
  ) {
    this.initializeApp();
    
    this.authService.getAuthState().subscribe(async user => {
      this.isAuthenticated = !!user;
      if (user) {
        const userData = await this.authService.getUserData();
        if (userData) {
          this.nombreUsuario = userData.usuario;
          this.likesCount = await this.authService.getUserLikesCount(user.uid);
        }
      } else {
        this.nombreUsuario = '';
        this.likesCount = 0;
      }
    });
  }

  async initializeApp() {
    await this.platform.ready();

    this.isAuthenticated = await this.authService.isAuthenticated();
    if (this.isAuthenticated) {
      const userData = await this.authService.getUserData();
      if (userData) {
        this.nombreUsuario = userData.usuario;
        this.likesCount = await this.authService.getUserLikesCount(userData.uid);
      }
    }

    setTimeout(() => {
      this.showSplash = false;
      if (this.isAuthenticated) {
        this.router.navigate(['/home']);
      }
    }, 2000);
  }

  async logout() {
    await this.authService.logout();
    this.isAuthenticated = false;
    this.nombreUsuario = '';
    this.likesCount = 0;
    await this.storageService.removeItem('SessionId'); // Elimia la sesión del usuario-.
    this.router.navigate(['/login']);
  }
}