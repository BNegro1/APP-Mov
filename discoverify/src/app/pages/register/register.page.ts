import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  formData: any = {
    email: '',
    password: '',
  };

  showPassword: boolean = false; // Mostrar contraseña 

  campoCorreo: string = '';
  campoContrasenna: string = '';

  constructor(public router: Router) {}

  ngOnInit() {}


  toggleShowPassword() { // Alternar visivbilidad de contraseña
    this.showPassword = !this.showPassword;
  }

  registrar() {
    if (this.validarDatos(this.formData)) {
      let navigationExtras: NavigationExtras = {
        state: { userEmail: this.formData.email },
      };
      this.router.navigate(['/home'], navigationExtras);
    }
  }

  validarDatos(model: any): boolean {
    this.campoCorreo = '';
    this.campoContrasenna = '';

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // !!! TENER EN CUENTA EL PATRÓN DE CARACTERES !!!
    if (!model.email || !emailPattern.test(model.email)) {
      this.campoCorreo = 'Por favor ingrese un correo electrónico válido.';
      return false;
    }

    // Validación de la contraseña (mínimo 6 caracteres, al menos una letra y un número)
    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/; // !!! TENER EN CUENTA EL PATRÓN DE CARACTERES !!!
    if (!model.password || !passwordPattern.test(model.password)) {
      this.campoContrasenna =
        'Contraseña erronea: La contraseña debe tener al menos 6 caracteres, e incluir una letra y un número.';
      return false;
    }

    return true;
  }
}
