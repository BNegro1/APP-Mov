import { Component, OnInit } from '@angular/core';
import { FirebaseLoginService } from 'src/app/services/firebase/firebase-ser.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  nombreUsuario: string | null = '';
  email: string | null = '';
  likesCount: number = 0;
  isAuthenticated: boolean = false;

  constructor(
    private firebaseLoginService: FirebaseLoginService,
    private router: Router,

  ) { }

  async ngOnInit() {
    this.isAuthenticated = await this.firebaseLoginService.isAuthenticated();

    const userData = await this.firebaseLoginService.getUserData();
    if (userData) {
      this.nombreUsuario = userData.usuario;
      this.email = userData.email;
      this.likesCount = await this.firebaseLoginService.getUserLikesCount(userData.uid);
    }
  }
  
}
