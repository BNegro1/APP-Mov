import { Component, OnInit } from '@angular/core';
import { FirebaseLoginService } from 'src/app/services/firebase/firebase-ser.service'; // Importar FirebaseLoginService

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  nombreUsuario: string = '';
  email: string = '';

  constructor(private firebaseLoginService: FirebaseLoginService) { }

  async ngOnInit() {
    const userData = await this.firebaseLoginService.getUserData();
    if (userData) {
      this.nombreUsuario = userData.usuario;
      this.email = userData.email;
    }
  }
}
