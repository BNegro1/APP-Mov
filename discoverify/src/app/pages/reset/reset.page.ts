import { Component, OnInit } from '@angular/core';
import { DbService } from 'src/app/services/dbservice.service'; // Para manejar la base de datos de usuarios
import { AuthService } from 'src/app/services/auth.service'; // Importar AuthService para obtener el usuario autenticado
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

  constructor(private dbService: DbService, private authService: AuthService, private toastController: ToastController) { }

  ngOnInit() { }

  // Restablecer la contraseña
  async resetPassword() {
    const userEmail = await this.authService.getNombreUsuario(); // Obtener el email del usuario autenticado

    // Verificar si el correo electrónico es null
    if (!userEmail) {
      this.presentToast('No se pudo obtener el correo del usuario.');
      return;
    }

    // Verificar si la contraseña actual es correcta
    const isOldPasswordValid = await this.dbService.validateUser(userEmail, this.formData.oldPassword);

    if (!isOldPasswordValid) {
      this.presentToast('La contraseña actual es incorrecta');
      return;
    }

    // Verificar que las nuevas contraseñas coincidan
    if (this.formData.newPassword !== this.formData.confirmPassword) {
      this.presentToast('Las contraseñas no coinciden');
      return;
    }

    // Actualizar la contraseña en la base de datos
    await this.dbService.updateUserPassword(userEmail, this.formData.newPassword);
    this.presentToast('Contraseña restablecida con éxito');
  }

  // Método para alternar la visibilidad de la contraseña
  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }

  // Toast para mostrar mensajes
  async presentToast(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 3000,
    });
    toast.present();
  }
}
