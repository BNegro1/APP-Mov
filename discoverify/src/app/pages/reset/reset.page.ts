import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';


// Página para restablecer la contraseña
// Si no sirve, se puede intentar con el método de AuthService!!! (Tenerlo en mente)

@Component({
  selector: 'app-reset',
  templateUrl: './reset.page.html',
  styleUrls: ['./reset.page.scss'],
})
export class ResetPage implements OnInit {
  formData = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  showPassword = false;


  ngOnInit() { }

}
