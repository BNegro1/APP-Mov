import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  
  // Modelo completo para el registro: User y Password.
  register: any = {
    email: '',
    contrasenna: '',
  };

  // Variables para ambos inputs cuando estén vacios.
  campoCorreo: string = '';
  campoContrasenna: string = '';

  constructor(public router: Router) {}

  ngOnInit() {}

  registrar() {
    if (this.validarDatos(this.register)) {
      // Creación de parámetros, misma forma: "{ state: {register: this.register} };"
      let navigationExtras: NavigationExtras = {
        state: { userEmail: this.register.email },
      }; // Rescatamos el email para guardarlo y mostrarlo en page home.
      this.router.navigate(['/home'], navigationExtras);
    }
  }

  /**
   * validarDatos para validar el ingreso de algo en los
   * campos de mi html mediante el modelo register
   */
  validarDatos(model: any): boolean {
    // Validación del correo electrónico
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

    // Validación de la contrasenna (Contraseña)
    // !!! La contraseña debe ser "admin" o "123" !!!
    if (
      !model.contrasenna ||
      !(model.contrasenna === 'admin' || model.contrasenna === '123')
    ) {
      this.campoContrasenna = 'contrasenna';
      return false;
    }

    // Reinicio de errores.
    this.campoCorreo = '';
    this.campoContrasenna = '';
    return true;
  }
}
