import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  // Modelo completo para el login: User y Password.
  // En este caso se usa el type especial "any" para indicar
  // que no se busca un valor en particular para causar errores.

  login: any={
    email:"",
    password:""
  }

  // Variable para el input del correo cuando esté vacío.
  campoCorreo: string="";
  constructor(public router: Router,public toastController:ToastController) { }

  ngOnInit() {
  }

  ingresar(){
    if(this.validateModel(this.login)){
      // Creación de parámetros, misma forma: "{ state: {login: this.login} };"   
      let navigationExtras : NavigationExtras = {
        state: {login: this.login}
      };
      this.router.navigate(['/home'], navigationExtras);
      this.mostrarToast("top","Bienvenido",5000)
    }else{
      this.mostrarToast("middle","Error - Falta: "+this.campoCorreo);
    }    
  }

  /**
   * validateModel para validar el ingreso de algo en los
   * campos de mi html mediante el modelo login
   */
  validateModel(model:any){
    // Recorro todas las entradas que me entrega el Object entries obteniendo
    // el par key : value
    for (var [key ,value] of Object.entries(model)){
      // Reviso si value = "" y retorno false e indico campo faltante
      if(value == ""){
        this.campoCorreo = key;
        return false;
      }
    } 
    // Si termina el ciclo for es que los valores fueron ingresados
    return true;
  }


  // Opciones para el Toast:
  // https://ionicframework.com/docs/api/toast#toastoptions

  async mostrarToast(position: 'top' | 'middle' | 'bottom', msg:string, duration?:number) {
    const toast = await this.toastController.create({
      message: msg,
      duration: duration?duration:2500,
      position: position,
      icon: "alert",
      cssClass: 'toast-background' 
      
    });
    // el "toast-background" está definido en:
    // src/global.scss
    // Se encuentran todos los estilos globales
    await toast.present();
  }

}
