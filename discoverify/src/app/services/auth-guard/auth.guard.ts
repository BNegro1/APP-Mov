import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private storage: Storage, private router: Router) {
    this.init();
  }

  async init() {
    await this.storage.create();
  }

  async canActivate(): Promise<boolean | UrlTree> {
    const logueado = await this.storage.get("SessionId");

    if (logueado) {
      return true;
    } else {
      return this.router.createUrlTree(['/login']);
    }
  }
}
