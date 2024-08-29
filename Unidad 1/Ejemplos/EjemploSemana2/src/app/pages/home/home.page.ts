import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  //usuario?:String;
  niveles:any[]=[
    {id:1,nivel:"Basica Incompleta"},
    {id:2,nivel:"Basica Completa"},
    {id:3,nivel:"Media Incompleta"},
    {id:4,nivel:"Media Completa"},
    {id:5,nivel:"Media Incompleta"},
    {id:6,nivel:"Superior Completa"}
  ]
  //Construyo un modelo para limpiar
  data:any={
    nombre:"",
    apellido:"",
    education:"",
    nacimiento:""
  };

  constructor(public alertController:AlertController) {}
  /**
   * Metodo limpíar recorre un objeto y se define el 
   * valor de su propiedad en ""
   */
 limpiar(){
  for (var [key, value] of Object.entries(this.data)) {
    Object.defineProperty(this.data,key,{value:""})
  }
}

mostrar(){
  (this.data.nombre!="" && this.data.apellido!="") && 
  this.presentAlert("Usuario","Su nombre es "+this.data.nombre+" "+this.data.apellido)||
  this.presentAlert("Error","Debe Ingresar Nombre y Apellido!!");
}

async presentAlert(titulo:string,message:string) {
  const alert = await this.alertController.create({
    header: titulo,
    message: message,
    buttons: ['OK']
  });

  await alert.present();
}


}
