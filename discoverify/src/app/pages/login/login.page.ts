import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { DbService } from 'src/app/services/dbservice.service'; // Importamos el servicio de BD

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  login = {
    email: '',
    contrasenna: '',
  };

  campoCorreo = '';
  campoContrasenna = '';
  showPassword = false; // Variable para mostrar/ocultar la contraseña en el formulario

  constructor(private dbService: DbService, private router: Router) {}

  ngOnInit() {}

  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  async ingresar() {
    if (this.validarDatos(this.login)) {
      const isValidUser = await this.dbService.validateUser( // validateUser para validar email y contraseña
        this.login.email,
        this.login.contrasenna
      );

      if (isValidUser) {
        let navigationExtras: NavigationExtras = {
          state: { userEmail: this.login.email },
        };
        this.router.navigate(['/home'], navigationExtras); // Ingreso exitoso.
      } else {
        this.campoCorreo = 'El correo o la contraseña son incorrectos.';
      }
    }
  }

  validarDatos(model: any): boolean {
    this.campoCorreo = '';
    this.campoContrasenna = '';

    // Validación del correo electrónico
    if (!model.email || !model.email.includes('@')) {
      this.campoCorreo = 'Por favor ingrese un correo electrónico válido.';
      return false;
    }

    // Validación de la contraseña (mínimo 6 caracteres)
    if (!model.contrasenna || model.contrasenna.length < 6) {
      this.campoContrasenna = 'La contraseña debe tener al menos 6 caracteres.';
      return false;
    }

    return true;
  }
}
