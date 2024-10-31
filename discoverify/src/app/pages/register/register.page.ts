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

export class RegisterPage implements OnInit { // Se define la clase RegisterPage.
  formData = {
    email: '',
    password: '',
    nombreUsuario: ''
  }; // Se inicializa el objeto formData con los campos email, password y nombreUsuario vacíos


  // Se inicializan los campos de error con un string vacío para que no se muestre ningún mensaje de error al principio de la página de registro
  campoCorreo = '';
  campoContrasenna = '';
  campoNombreUsuario = '';
  showPassword = false;

  // Se crea un constructor con el ToastController como mensaje, access de Firebase Login y el ruteo con Router
  constructor(
    private firebaseLoginService: FirebaseLoginService, // Agregar FirebaseLoginService
    private router: Router,
    private toastController: ToastController // Asegurarse de incluir ToastController si es necesario
  ) { }

  ngOnInit() { }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  } // Se define el método toggleShowPassword que cambia el valor de la variable showPassword entre true y false

  async registrar() { // Se define el método registrar como async
    if (this.validarDatos(this.formData)) { // sI los datos son válidos, se procede a registrar al usuario
      try { // Entonces ...
        await this.firebaseLoginService.register( // Se llama al método register del servicio FirebaseLoginService

          // Entonces: Se pasan los datos del formulario al método register del servicio FirebaseLoginService
          this.formData.email,
          this.formData.password,
          this.formData.nombreUsuario
        );

        
        // Navegar a la página de inicio después del registro exitoso
        let navigationExtras: NavigationExtras = { // Se define el objeto navigationExtras con el correo electrónico del usuario
          state: { userEmail: this.formData.email },
        };
        this.router.navigate(['/home'], navigationExtras); // FInaliza con la redirección a la página de inicio
      } catch (error) { // De lo contrario, si ocurre un error durante el registro, se muestra un mensaje de error
        const toast = await this.toastController.create({
          message: 'Ocurrió un error durante el registro. Por favor, inténtelo de nuevo.', // Entonces tiene un mensaje de error
          duration: 3000,
          position: 'bottom'
        });
        toast.present();
      }
    }
  }

  validarDatos(model: any): boolean { // Se define el método validarDatos que recibe un objeto model y devuelve un valor booleano

    // Se inicializan los campos de error con un string vacío
    this.campoCorreo = '';
    this.campoContrasenna = '';
    this.campoNombreUsuario = '';


    // Se valida el campo de correo electrónico
    if (!model.email || !model.email.includes('@')) {
      this.campoCorreo = 'Por favor ingrese un correo electrónico válido.';
      return false;
    } // Si el campo de correo electrónico está vacío o no contiene el carácter '@', se muestra un mensaje de error en el campo de correo electrónico

    if (!model.password || model.password.length <= 2) {
      this.campoContrasenna = 'La contraseña debe tener más de 2 caracteres.';
      return false; // Si el campo de contraseña está vacío o tiene menos de 3 caracteres, se muestra un mensaje de error en el campo de contraseña
    }
 
    const nombreUsuarioPattern = /^[a-zA-Z0-9 .]+$/; // IMPORTANTE: Se define una expresión regular para validar el nombre de usuario!!! IMPORTANTE !!!
    if (!model.nombreUsuario || !nombreUsuarioPattern.test(model.nombreUsuario)) {
      this.campoNombreUsuario = 'El nombre de usuario solo puede contener letras, espacios, puntos y números.';
      return false;
    }

    return true;
  }
}