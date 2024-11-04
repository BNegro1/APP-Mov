import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { FirebaseLoginService } from 'src/app/services/firebase/firebase-ser.service'; // Importar FirebaseLoginService
import { trigger, state, style, animate, transition } from '@angular/animations'; // Aniamciones
import { ToastController } from '@ionic/angular'; // Importar ToastController
import { Storage } from '@ionic/storage-angular'; // Importar Storage



// Animaciones de la página de login
// Se definen las animaciones fadeInAnimation, slideInAnimation, pulseAnimation y shakeAnimation
// fadeInAnimation: animación de desvanecimiento
// slideInAnimation: animación de deslizamiento
// pulseAnimation: animación de pulso
// shakeAnimation: animación de sacudida
// fadeInAnimation: animación de desvanecimiento


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
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


export class LoginPage implements OnInit {
  login = {
    email: '',
    contrasenna: '',
  };

  campoCorreo = '';
  campoContrasenna = '';
  showPassword = false;
  isLoading = false; // Control de "carga"

  constructor(
    private firebaseLoginService: FirebaseLoginService,
    private router: Router,
    private toastController: ToastController,
    private storage: Storage
  ) {
    this.initStorage();
    this.checkExistingSession(); // Verificar sesión existente al iniciar
  }

  async initStorage() {
    await this.storage.create();
  }

  async checkExistingSession() {
    const sessionId = await this.storage.get('SessionId');
    if (sessionId) {
      this.router.navigate(['/home'], { // Si existe una sesión, navegar directamente al home
        replaceUrl: true // Esto previene que el usuario pueda volver atrás al login
      });
    }
  }

  ngOnInit() { }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  async ingresar() {
    if (this.isLoading) return; // Evitar múltiples logins simultáneos

    if (!this.validarDatos(this.login)) {
      const toast = await this.toastController.create({
        message: this.campoCorreo || this.campoContrasenna,
        duration: 2000,
        position: 'bottom',
        color: 'danger'
      });
      await toast.present();
      return;
    }

    try {
      this.isLoading = true; // Activar "estado de carga""

      const result = await this.firebaseLoginService.login(
        this.login.email,
        this.login.contrasenna
      );

      if (result.user?.uid) {
        await this.storage.set('SessionId', result.user.uid);

        const toast = await this.toastController.create({
          message: '¡Bienvenido!',
          duration: 2000,
          position: 'bottom',
          color: 'success'
        });
        await toast.present();

        // Navegar inmediatamente después del login exitoso
        await this.router.navigate(['/home'], {
          replaceUrl: true // Esto reemplaza la página actual 
        });
      }
    } catch (error: any) {
      const toast = await this.toastController.create({
        message: this.getErrorMessage(error.code) || error.message,
        duration: 3000,
        position: 'bottom',
        color: 'danger'
      });
      await toast.present();
    } finally {
      this.isLoading = false; // Desactivar estado de carga SIEMPRE Y CUANDO ocurra un error.
    }
  }

  // Manejo de errores especificos.
  private getErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'Usuario no encontrado';
      case 'auth/wrong-password':
        return 'Contraseña incorrecta';
      case 'auth/invalid-email':
        return 'Correo electrónico inválido';
      case 'auth/user-disabled':
        return 'Usuario deshabilitado';
      default:
        return 'Error al iniciar sesión';
    }
  }

  validarDatos(model: any): boolean {
    this.campoCorreo = '';
    this.campoContrasenna = '';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!model.email || !emailRegex.test(model.email)) {
      this.campoCorreo = 'Por favor ingrese un correo electrónico válido';
      return false;
    }

    if (!model.contrasenna || model.contrasenna.length < 6) {
      this.campoContrasenna = 'La contraseña debe tener al menos 6 caracteres.';
      return false;
    }

    return true;
  }
}