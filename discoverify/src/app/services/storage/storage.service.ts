import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root',
})
export class StorageService { // Crear servicio StorageService
  constructor(
    private auth: AngularFireAuth, // Inyectar AngularFireAuth
    private db: AngularFirestore // Inyectar AngularFirestore
  ) { }


  // Se definirán como item, los datos del usuario.
  // Se definirán como key, el nombre del item
  setItem(key: string, value: any): void { // Guardar un item en el localStorage
    localStorage.setItem(key, JSON.stringify(value)); // Convertir a JSON antes de guardar
  }

  getItem(key: string): any { // Obtener un item del localStorage
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  }

  removeItem(key: string): void { // Eliminar un item del localStorage
    localStorage.removeItem(key); 
  } 

  async saveUserData(user: any): Promise<void> { // Guardar datos del usuario en Firebase
    const userId = (await this.auth.currentUser)?.uid;
    if (userId) {
      await this.db.collection('users').doc(userId).set(user);
      this.setItem('userData', user); // Guardar también en localStorage
    }
  }

  async getUserData(): Promise<any> { // Obtener datos del usuario
    const localData = this.getItem('userData');
    if (localData) {
      return localData;
    }

    const userId = (await this.auth.currentUser)?.uid; // Obtener el ID del usuario autenticado
    if (userId) {
      const doc = await this.db.collection('users').doc(userId).get().toPromise();
      const userData = doc?.data();
      if (userData) {
        this.setItem('userData', userData); // Guardar en localStorage para futuras referencias
      }
      return userData;
    }
    return null;
  }
}