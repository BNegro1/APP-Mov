import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/auth guard/auth.guard';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  showSplash = true;
  constructor(private router: Router, private platform: Platform, private authService: AuthService) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      const isAuthenticated = this.authService.isAuthenticated();
      setTimeout(() => {
        this.showSplash = false;
      }, 2000);
      if (isAuthenticated) {
        this.router.navigate(['/home']); // Redirigir a la página de inicio si está autenticado
      } else {
        this.router.navigate(['/login']); // Redirigir a la página de login si no está autenticado
      }
    });
  }
}
