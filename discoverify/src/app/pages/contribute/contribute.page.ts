import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { FirebaseLoginService } from '../../services/firebase/firebase-ser.service';

@Component({
  selector: 'app-contribute',
  templateUrl: './contribute.page.html',
  styleUrls: ['./contribute.page.scss'],
})
export class ContributePage {
  album = {
    title: '',
    artist: '',
    cover: '' 
  };

  constructor(private navCtrl: NavController, private firebaseLoginService: FirebaseLoginService) {}

  onFileChange(event: any) {
    const reader = new FileReader();
    if(event.target.files && event.target.files.length) {
      const file = event.target.files[0];
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.album.cover = reader.result as string;
      };
    }
  }

  submitForm() {
    this.firebaseLoginService.saveAlbum(this.album)
      .then(() => {
        console.log('Nuevo álbum guardado:', this.album);
        this.navCtrl.navigateBack('/home');
      })
      .catch(error => {
        console.error('Error al guardar el álbum:', error);
      });
  }
}
