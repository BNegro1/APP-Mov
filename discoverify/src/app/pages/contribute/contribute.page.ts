import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-contribute',
  templateUrl: './contribute.page.html',
  styleUrls: ['./contribute.page.scss'],
})
export class ContributePage {
  album = {
    title: '',
    artist: '',
    releaseDate: '',
    genre: '',
  };

  constructor(private navCtrl: NavController) {}

  submitForm() {
    const albumJson = JSON.stringify(this.album); // Convertir el objeto album a una cadena JSON
    localStorage.setItem('album', albumJson); // Guardar la cadena JSON en localStorage con la clave 'album'
    console.log('Nuevo álbum:', this.album); // Imprimir el álbum en la consola
    this.navCtrl.navigateBack('/home'); // Imprimir el álbum en la consola
  }
}
