import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { FirebaseLoginService } from 'src/app/services/firebase/firebase-ser.service';

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

  constructor(
    private toastController: ToastController,
    private firebaseLoginService: FirebaseLoginService
  ) { }

  ngOnInit() { }

  // Método para mostrar u ocultar la contraseña
  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  // Async para restablecer la contraseña, debido a que se necesita esperar la respuesta del servidor
  // Por lo tanto, se utiliza el método resetPassword y sino, se muestra un mensaje de error.
  async resetPassword() {
    const { oldPassword, newPassword, confirmPassword } = this.formData;

    if (newPassword !== confirmPassword) {
      const toast = await this.toastController.create({ // Se crea un mensaje emergente con el error
        message: 'Las contraseñas no coinciden.',
        duration: 2000,
        color: 'danger'
      });
      await toast.present(); // Se muestra un mensaje emergente con el error
      return;
    }

    try {
      await this.firebaseLoginService.changePassword(oldPassword, newPassword);
      const toast = await this.toastController.create({
        message: 'Contraseña restablecida con éxito.',
        duration: 2000,
        color: 'success'
      });
      await toast.present();

      // Limpiar los campos del formulario
      this.formData = {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      };
    } catch (error: any) {
      let mensaje = 'Error al restablecer la contraseña.';
      if (error.code === 'auth/wrong-password') {
        mensaje = 'La contraseña actual es incorrecta.';
      } else if (error.code === 'auth/weak-password') {
        mensaje = 'La nueva contraseña es demasiado débil.';
      }
      const toast = await this.toastController.create({
        message: mensaje,
        duration: 3000,
        color: 'danger'
      });
      await toast.present();
    }
  }
}