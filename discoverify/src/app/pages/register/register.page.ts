import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { DbService } from 'src/app/services/dbservice.service'; // Importamos el servicio de BD

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  formData = {
    email: '',
    password: '',
  };

  campoCorreo = '';
  campoContrasenna = '';
  showPassword = false; // False para ocultar la contraseña en el formulario

  constructor(private dbService: DbService, private router: Router) {}

  ngOnInit() {}

  // Alterna la visibilidad de la contraseña
  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  // Método de registro
  async registrar() {
    if (this.validarDatos(this.formData)) {
      const userExists = await this.dbService.userExists(this.formData.email); // Verificamos si el correo ya está registrado
      if (userExists) {
        this.campoCorreo =
          'Este correo ya está registrado. Por favor, use otro.';
      } else {
        await this.dbService.addUser(
          this.formData.email,
          this.formData.password
        ); // Agregamo nuevo usuario a la base de datos

        let navigationExtras: NavigationExtras = {
          state: { userEmail: this.formData.email },
        };
        this.router.navigate(['/home'], navigationExtras); // Ir a la página de inicio tras registro realizado correctamente.
      }
    }
  }

  // Validar datos del formulario
  validarDatos(model: any): boolean {
    this.campoCorreo = '';
    this.campoContrasenna = '';

    // Validación del correo electrónico (debe contener "@")
    if (!model.email || !model.email.includes('@')) {
      this.campoCorreo = 'Por favor ingrese un correo electrónico válido.';
      return false;
    }

    // Validación de la contraseña (Más de 4 caracteres)
    if (!model.password || model.password.length > 4) {
      this.campoContrasenna = 'La contraseña debe tener más de 4 caracteres.';
      return false;
    }

    return true;
  }
}
