import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { FirebaseLoginService } from 'src/app/services/firebase/firebase-ser.service'; // Importar FirebaseLoginService
import { trigger, state, style, animate, transition } from '@angular/animations'; // Aniamciones
import { ToastController } from '@ionic/angular'; // Importar ToastController



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
    private toastController: ToastController // Inyectar ToastController
  ) { }

  ngOnInit() { }

  // Se define el método toggleShowPassword que cambia el valor de la variable showPassword entre true y false (Lo mismo aplica en forgotPassword)
  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }


  // Se define el método ingresar que se ejecuta al hacer clic en el botón de ingreso
  async ingresar() {
    if (this.validarDatos(this.login)) { // Si los datos son válidos, se intenta iniciar sesión
      try { // ENtonces, se intenta iniciar sesión con el correo electrónico y la contraseña proporcionados
        await this.firebaseLoginService.login(this.login.email, this.login.contrasenna); // "await" para esperar la respuesta de la promesa
        let navigationExtras: NavigationExtras = { // Si el inicio de sesión es exitoso, se redirige al usuario a la página de inicio
          state: { userEmail: this.login.email }, // ENTONCES, se define el objeto navigationExtras con el correo electrónico del usuario
        };
        this.router.navigate(['/home'], navigationExtras); // Se redirige al usuario a la página de inicio con el objeto navigationExtras
      } catch (error) { // Si se produce un error al iniciar sesión, se muestra un mensaje de error en el campo de correo
        this.campoCorreo = 'El correo o la contraseña son incorrectos.'; // Por lo tanto, se muestra un mensaje de error en el campo de correo
        const toast = await this.toastController.create({
          message: 'El correo o la contraseña son incorrectos.',
          duration: 3000,
          position: 'bottom'
        });
        toast.present(); // Se muestra un mensaje emergente con el error
      }
    }
  }

  // Se valida el correo electrónico y la contraseña y se redirige al usuario a la página de inicio si los datos son correctos
  validarDatos(model: any): boolean {

    // Se inicializan los campos de error con un string vacío
    this.campoCorreo = '';
    this.campoContrasenna = '';


    // Aquí se validan los datos del usuario
    if (!model.email || !model.email.includes('@')) { // Si el correo electrónico no está presente o no contiene un "@" se muestra un mensaje de error en el campo de correo
      this.campoCorreo = 'Por favor ingrese un correo electrónico válido.';
      return false;
    }

    // Aquí se valida la !!! contraseña !!! del usuario
    if (!model.contrasenna || model.contrasenna.length < 4) { // Si la contraseña no está presente o tiene menos de 6 caracteres se muestra un mensaje de error en el campo de contraseña
      this.campoContrasenna = 'La contraseña debe tener al menos 4 caracteres.';
      return false;
    }

    return true;
  }
}