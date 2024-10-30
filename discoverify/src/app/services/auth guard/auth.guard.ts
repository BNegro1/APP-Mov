import { Injectable } from '@angular/core';
import { CanActivateFn, Router} from '@angular/router';
import { Storage } from '@ionic/storage-angular';



@Injectable({
  providedIn : 'root'
})

export class AuthGuard{
  constructor(private storage : Storage , private route : Router){
    this.init();
  }
  async init(){
    await this.storage.create();
  }
  canActivate : CanActivateFn = async (route, state) => {
    const logueado = await this.storage.get("SessionId");

    if(logueado){
      return true;
    }
    else{
      return this.route.createUrlTree(['/login']);

    }
  }
}

