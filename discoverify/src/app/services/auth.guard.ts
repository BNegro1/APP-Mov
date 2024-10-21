import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})

// UrlTree es un tipo de Angular que representa una URL o un árbol de URL
// Por qué? Porque la función canActivate() puede devolver un booleano o un UrlTree
// Si devuelve un booleano, la navegación se permite o se bloquea.

// Investigar más, aunque con esto basta mietras (?)

export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree { // Comprueba si el usuario está autenticado
      // Explicación breve: si el usuario está autenticado, devuelve true; si no, redirige al usuario a la página de login
    if (this.authService.isAuthenticated()) {
      return true;
    } else {
      // Redirige al usuario a la página de login si no está autenticado
      return this.router.createUrlTree(['/login']);
    }
  }
}