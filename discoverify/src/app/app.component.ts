import { Component } from '@angular/core';
import { Router } from '@angular/router'; // Importar módulo de rutas. Para redirigir a otras páginas.
import { AuthService } from './services/auth.service'; // Importar servicio de autenticación. Con el fin de cerrar sesión.
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})


// Implementar el método de cerrar sesión.
// Se encarga de cerrar sesión y redirigir a la página de inicio.

export class AppComponent {
  constructor() {}
}
