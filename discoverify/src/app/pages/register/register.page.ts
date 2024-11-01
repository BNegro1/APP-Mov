import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router'
import { FirebaseLoginService } from 'src/app/services/firebase/firebase-ser.service'; // Importamos FirebaseLoginService desde el servicio de Firebase
import { trigger, state, style, animate, transition } from '@angular/animations';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  animations: [
    trigger('fadeInAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms', style({ opacity: 1 })),
      ]),
    ]),
    trigger('slideInAnimation', [
      transition(':enter', [
        style({ transform: 'translateY(50%)', opacity: 0 }),
        animate('500ms', style({ transform: 'translateY(0)', opacity: 1 })),
      ]),
    ]),
    trigger('pulseAnimation', [
      state('in', style({ transform: 'scale(1)' })),
      transition('void => *', [
        style({ transform: 'scale(0.5)' }),
        animate('300ms ease-in-out', style({ transform: 'scale(1.05)' })),
        animate('200ms ease-in-out', style({ transform: 'scale(1)' })),
      ]),
    ]),
    trigger('shakeAnimation', [
      transition('* => *', [
        style({ transform: 'translate3d(0, 0, 0)' }),
        animate('300ms', style({ transform: 'translate3d(-10px, 0, 0)' })),
        animate('100ms', style({ transform: 'translate3d(10px, 0, 0)' })),
        animate('100ms', style({ transform: 'translate3d(-10px, 0, 0)' })),
        animate('100ms', style({ transform: 'translate3d(0, 0, 0)' })),
      ]),
    ]),
  ],
})

export class RegisterPage implements OnInit {
  // Modelo de datos del formulario
  formData = {
    email: '',
    password: '',
    nombreUsuario: ''
  };

  // Variables para manejo de errores y UI
  campoCorreo = '';
  campoContrasenna = '';
  campoNombreUsuario = '';
  showPassword = false;

  constructor(
    private firebaseLoginService: FirebaseLoginService,
    private router: Router,
    private toastController: ToastController
  ) { }

  ngOnInit() { }

  // Alternar visibilidad de la contraseña
  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }


  // Método principal para el registro de usuarios
  // Valida los datos y maneja el proceso de registro con Firebase

  async registrar() {
    if (this.validarDatos(this.formData)) {
      try {
        // Intenta registrar al usuario con Firebase
        const result = await this.firebaseLoginService.register(
          this.formData.email,
          this.formData.password,
          this.formData.nombreUsuario
        );

        if (typeof result === 'string') {
          // Muestra mensaje de error si el registro falla
          await this.mostrarToast(result, 'danger');
        } else {
          // Registro exitoso: navega a la página principal
          let navigationExtras: NavigationExtras = {
            state: { userEmail: this.formData.email },
          };
          this.router.navigate(['/home'], navigationExtras);
        }
      } catch (error) {
        // Manejo de errores inesperados
        await this.mostrarToast('Ocurrió un error durante el registro. Por favor, inténtelo de nuevo.', 'danger');
      }
    }
  }


  // Valida los datos del formulario de registro

  validarDatos(model: any): boolean {
    // Reinicia mensajes de error
    this.campoCorreo = '';
    this.campoContrasenna = '';
    this.campoNombreUsuario = '';

    // Validación del correo electrónico
    if (!model.email || !model.email.includes('@')) {
      this.campoCorreo = 'Por favor ingrese un correo electrónico válido.';
      return false;
    }

    // Validación de la contraseña
    if (!model.password || model.password.length < 6) {
      this.campoContrasenna = 'La contraseña debe tener al menos 6 caracteres.';
      return false;
    }

    // Validación del nombre de usuario
    const nombreUsuarioPattern = /^[a-zA-Z0-9._]+$/;
    if (!model.nombreUsuario || !nombreUsuarioPattern.test(model.nombreUsuario)) {
      this.campoNombreUsuario = 'El nombre de usuario solo puede contener letras, espacios, puntos y números.';
      return false;
    }

    return true;
  }

  // Método auxiliar para mostrar mensajes Toast
  private async mostrarToast(mensaje: string, color: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 3000,
      position: 'bottom',
      color: color
    });
    await toast.present();
  }
}