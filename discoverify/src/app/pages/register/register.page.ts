import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { DbService } from 'src/app/services/dbservice.service';


// CASOS DE PRUEBA PARA LA FUNCIÓN "validarDatos":
// Caso 1: Correo invalido
// Caso 2: Correo vacio
// Caso 3: menos de 3 caracteres en la contraseña



// Datos validos:
// Email: correo@dominio.com
// Contraseña: pass123
// Nombre de usuario: usuario
// Resultado esperado: true. (No se muestran mensajes de error)


@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
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

  constructor(private dbService: DbService, private router: Router) { }

  ngOnInit() { }

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  } // Se define el método toggleShowPassword que cambia el valor de la variable showPassword entre true y false

  async registrar() { // Se define el método registrar que se ejecuta al hacer clic en el botón de registro
    if (this.validarDatos(this.formData)) {
      this.dbService.userExists(this.formData.email).then(userExists => {
        if (userExists) {
          this.campoCorreo = 'Este correo ya está registrado. Por favor, use otro.'; // Si el usuario ya existe, se muestra un mensaje de error en el campo de correo
        } else {
          this.dbService.addUser(
            this.formData.email,
            this.formData.password,
            this.formData.nombreUsuario // Si el usuario no existe, se agrega a la base de datos
          ).then(() => {
            let navigationExtras: NavigationExtras = {
              state: { userEmail: this.formData.email }, 
            }; // Se crea un objeto navigationExtras con el correo electrónico del usuario
            this.router.navigate(['/home'], navigationExtras);
          }).catch(error => {
            console.error('Error insertando usuario: ', error);
          });
        }
      }).catch(error => {
        console.error('Error verificando si el usuario existe: ', error);
      }); // Se manejan los errores de la verificación y la inserción del usuario
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