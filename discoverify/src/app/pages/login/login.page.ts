import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { DbService } from 'src/app/services/dbservice.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})




export class LoginPage implements OnInit { // Implementar OnInit para inicializar el componente
  login = {
    email: '',
    contrasenna: '',
  };


  // Se inicializan los campos de error con un string vacío para que no se muestre ningún mensaje de error al principio de la página de login
  campoCorreo = '';
  campoContrasenna = '';
  showPassword = false;

  constructor(private dbService: DbService, private router: Router, private authService: AuthService) { } // Inyectar DbService, Router y AuthService

  ngOnInit() { }


  // Se define el método toggleShowPassword que cambia el valor de la variable showPassword entre true y false
  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }


  // Se define el método ingresar que se ejecuta al hacer clic en el botón de ingreso
  async ingresar() {
    if (this.validarDatos(this.login)) {
      const isValidUser = await this.dbService.validateUser(
        this.login.email,
        this.login.contrasenna
      ); // Se valida el usuario con el correo electrónico y la contraseña ingresados

      if (isValidUser) {
        this.authService.login('token', this.login.email); // Se inicia sesión con el correo electrónico del usuario
        let navigationExtras: NavigationExtras = {
          state: { userEmail: this.login.email },
        };
        this.router.navigate(['/home'], navigationExtras);
      } else {
        this.campoCorreo = 'El correo o la contraseña son incorrectos.'; // Si el usuario no es válido, se muestra un mensaje de error en el campo de correo
      }
    }
  }

  // Se valida el correo electrónico y la contraseña y se redirige al usuario a la página de inicio si los datos son correctos
  validarDatos(model: any): boolean {

    // Se inicializan los campos de error con un string vacío
    this.campoCorreo = '';
    this.campoContrasenna = '';

    if (!model.email || !model.email.includes('@')) { // Si el correo electrónico no está presente o no contiene un "@" se muestra un mensaje de error en el campo de correo
      this.campoCorreo = 'Por favor ingrese un correo electrónico válido.';
      return false;
    }

    if (!model.contrasenna || model.contrasenna.length < 6) { // Si la contraseña no está presente o tiene menos de 6 caracteres se muestra un mensaje de error en el campo de contraseña
      this.campoContrasenna = 'La contraseña debe tener al menos 6 caracteres.';
      return false;
    }

    return true;
  }
}