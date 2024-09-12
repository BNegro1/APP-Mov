import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';


@Component({
  selector: 'app-resetpass',
  templateUrl: './resetpass.page.html',
  styleUrls: ['./resetpass.page.scss'],
})
export class ResetpassPage implements OnInit {


    // Modelo completo para el login: User y Password.
    login: any = {
      email: "",
      contrasenna: ""
    };
  
    // Variables para ambos inputs cuando estén vacios.
    campoCorreo: string = "";
    campoContrasenna: string = "";
  
    constructor(public router: Router, public toastController: ToastController) { 
      
    }
  
    ngOnInit() {
  
     }

     ingresar() {
      if (this.validarDatos(this.login)) {
        // Creación de parámetros, misma forma: "{ state: {login: this.login} };"
        let navigationExtras: NavigationExtras = { state: { userEmail: this.login.email }  }; // Rescatamos el email para guardarlo y mostrarlo en page home.
        this.router.navigate(['/home'], navigationExtras);
  
        // Mostrar el toast correcto al loguearse (Creado en global.scss)
        this.mostrarToast("middle", "Bienvenido", 5000, 'toast-correcto');
      } else {
        let mensaje = this.campoCorreo ? "Error - Correo inválido" : "Error - Contraseña inválida";
        this.mostrarToast("middle", mensaje, undefined, 'toast-alerta');
      }
    }
    
  
    /**
     * validarDatos para validar el ingreso de algo en los
     * campos de mi html mediante el modelo login
     */
    validarDatos(model: any): boolean {
  
      // Validación del correo electrónico
      const emailArroba = '@';
      const emailDuoc = 'duocuc.cl';
  
      if (!model.email || !model.email.includes(emailArroba) || !model.email.includes(emailDuoc)) {
        this.campoCorreo = "email";
        return false;
      }
  
      // Reinicio de errores.
      this.campoCorreo = "";
      return true;
    }
  
    // Opciones para el Toast:
    // https://ionicframework.com/docs/api/toast#toastoptions
    async mostrarToast(position: 'top' | 'middle' | 'bottom', msg: string, duration?: number, cssClass?: string) {
      const toast = await this.toastController.create({
        message: msg,
        duration: duration ? duration : 2500,
        position: position,
        icon: "alert",
        cssClass: cssClass ? cssClass : 'toast-alerta' // Usar la clase CSS pasada o default 'toast-alerta'
      });
      await toast.present();
    }
    
}

