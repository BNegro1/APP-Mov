import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseLoginService } from './services/firebase/firebase-ser.service';
import { Platform } from '@ionic/angular';
import { StorageService } from './services/storage/storage.service'; // Importar StorageService

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  showSplash = true;

  constructor(
    private router: Router,
    private platform: Platform,
    private authService: FirebaseLoginService,
    private storageService: StorageService // Inyectar StorageService
  ) {
    this.initializeApp();
  }

  async initializeApp() {
    await this.platform.ready();

    // Eliminar lógica de recuperación de datos de usuario y autenticación

    setTimeout(() => {
      this.showSplash = false;
    }, 2000); // Ocultar la pantalla de inicio después de 2 segundos

    // Si el usuario está autenticado, redirigir a la página de inicio.
    this.router.navigate(['/home']);
  }
}