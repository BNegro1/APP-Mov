import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private storage: Storage, 
    private router: Router,
    private auth: AngularFireAuth // Añadido para verificar auth de Firebase
  ) {
    this.init();
  }

  // Inicializa el storage al crear el guard
  async init() {
    await this.storage.create();
  }

  // Método principal que verifica la autenticación
  async canActivate(): Promise<boolean | UrlTree> {
    // Primero verifica si hay usuario en Firebase
    const user = await firstValueFrom(this.auth.authState);
    
    if (user) {
      // Si hay usuario en Firebase, guarda su ID en storage
      await this.storage.set('SessionId', user.uid);
      return true;
    }
    
    // Si no hay usuario en Firebase, verifica el storage local
    const logueado = await this.storage.get("SessionId");
    if (logueado) {
      return true;
    }

    // Si no hay autenticación, redirige al login
    return this.router.createUrlTree(['/login']);
  }
}
