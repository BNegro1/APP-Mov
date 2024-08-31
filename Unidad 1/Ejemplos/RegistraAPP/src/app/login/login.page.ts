import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(private toastController: ToastController) { }

  ngOnInit() {
  }

  async showToast() {
    const toast = await this.toastController.create({
      message: 'Ingreso exitoso!',
      duration: 2000,
      color: 'success',
      animated: true,
    });
    toast.present();
  }
}
