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


// ENtonces, se define la clase LoginPage que implementa OnInit:
export class LoginPage implements OnInit { // Implementar OnInit para inicializar el componente
  login = {
    email: '',
    contrasenna: '',
  };
  
  // Se inicializan los campos de error con un string vacío para que no se muestre ningún mensaje de error al principio de la página de login
  campoCorreo = '';
  campoContrasenna = '';
  showPassword = false;

  constructor(
    private firebaseLoginService: FirebaseLoginService, // Inyectar FirebaseLoginService
    private router: Router,
    private toastController: ToastController, // Inyectar ToastController
    private storage: Storage // Agregar Storage
  ) {
    this.initStorage();
  }

  async initStorage() {
    await this.storage.create();
  }

  ngOnInit() { }

  // Se define el método toggleShowPassword que cambia el valor de la variable showPassword entre true y false
  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }


  // Método mejorado de login con manejo de sesión y feedback
  async ingresar() {
    if (!this.validarDatos(this.login)) {
      // Muestra errores de validación
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
      // Intenta hacer login con Firebase
      const result = await this.firebaseLoginService.login(this.login.email, this.login.contrasenna);
      
      // Si el login es exitoso, guarda la sesión
      if (result.user?.uid) {
        await this.storage.set('SessionId', result.user.uid);
        
        // Muestra mensaje de éxito
        const toast = await this.toastController.create({
          message: '¡Bienvenido!',
          duration: 2000,
          position: 'bottom',
          color: 'success'
        });
        await toast.present();
        
        // Asegurar navegación. VERIFICAR TIEMPO DE DEMORA!!!!!!!!!!!!!!!!!
        setTimeout(() => {
          this.router.navigate(['/home'], {
            replaceUrl: true
          });
        });
      }
    } catch (error: any) {
      // Maneja errores mostrando toast
      const toast = await this.toastController.create({
        message: error.message,
        duration: 3000,
        position: 'bottom',
        color: 'danger'
      });
      await toast.present();
    }
  }

  // Se valida el correo electrónico y la contraseña y se redirige al usuario a la página de "home" si los datos son correctos
  validarDatos(model: any): boolean {

    // Se inicializan los campos de error con un string vacío
    this.campoCorreo = '';
    this.campoContrasenna = '';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Expresión regular para validar el correo electrónico
    if (!model.email || !emailRegex.test(model.email)) {
      this.campoCorreo = 'Por favor ingrese un correo electrónico válido';
      return false;
    }

    // Validación de la contraseña consistente con el registro
    if (!model.contrasenna || model.contrasenna.length < 6) {
      this.campoContrasenna = 'La contraseña debe tener al menos 6 caracteres.';
      return false;
    }

    return true;
  }
}