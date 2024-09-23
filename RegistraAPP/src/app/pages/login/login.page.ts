import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations'; // Importar animaciones

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  animations: [
    trigger('fadeIn', [
      state('void', style({ opacity: 0 })),
      transition(':enter', [animate('0.8s ease-in')]),
    ]),
    trigger('slideIn', [
      state('void', style({ transform: 'translateX(-100%)' })),
      transition(':enter', [animate('0.8s ease-out')]),
    ]),
  ],
})
export class LoginPage implements OnInit {
  login: any = {
    email: '',
    contrasenna: '',
  };

  campoCorreo: string = '';
  campoContrasenna: string = '';

  constructor(public router: Router, public toastController: ToastController) {}

  ngOnInit() {}

  ingresar() {
    if (this.validarDatos(this.login)) {
      let navigationExtras: NavigationExtras = {
        state: { userEmail: this.login.email },
      };
      this.router.navigate(['/home'], navigationExtras);

      // Mostrar el toast correcto al loguearse (Creado en global.scss)
      this.mostrarToast('middle', 'Bienvenido', 3000, 'toast-correcto');
    } else {
      let mensaje = this.campoCorreo
        ? 'Error - Correo inválido'
        : 'Error - Contraseña inválida';
      this.mostrarToast('middle', mensaje, undefined, 'toast-alerta');
    }
  }

  reestablecer() {
    this.router.navigate(['/reestablecido']);
  }

  validarDatos(model: any): boolean {
    const emailArroba = '@';
    const emailDuoc = 'duocuc.cl';

    if (
      !model.email ||
      !model.email.includes(emailArroba) ||
      !model.email.includes(emailDuoc)
    ) {
      this.campoCorreo = 'email';
      return false;
    }

    if (
      !model.contrasenna ||
      !(model.contrasenna === 'admin' || model.contrasenna === '123') // !!!!! Datos de testeo para el usuario que ingresa !!!!!
    ) {
      this.campoContrasenna = 'contrasenna';
      return false;
    }

    this.campoCorreo = '';
    this.campoContrasenna = '';
    return true;
  }

  async mostrarToast(
    position: 'top' | 'middle' | 'bottom',
    msg: string,
    duration?: number,
    cssClass?: string
  ) {
    const toast = await this.toastController.create({
      message: msg,
      duration: duration ? duration : 2500,
      position: position,
      icon: 'alert',
      cssClass: cssClass ? cssClass : 'toast-alerta',
    });
    await toast.present();
  }
}
