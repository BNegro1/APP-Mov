import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, DocumentSnapshot } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { firstValueFrom } from 'rxjs';

interface UserData {
  email: string;
  usuario: string;
  uid: string;
}

@Injectable({
  providedIn: 'root'
})

export class FirebaseLoginService {
  

  constructor(
    
    private auth: AngularFireAuth,
    private db: AngularFirestore,
    private router: Router

  ) { }


  // Metodo de login 
  login(email: string, password: string) {
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  // Deslogearse y redirigir al inicio.
  logout() {
    this.auth.signOut();
    this.router.navigate(['/']);
  }

  // Crear usuario dentro de firebase, autentigicacion y base de datos.
  async register(email: string, password: string, usuario: string) {
    try {
      const existingUser = await this.auth.fetchSignInMethodsForEmail(email);
      if (existingUser.length > 0) {
        throw { code: 'auth/email-already-in-use' };
      }
      const credenciales = await this.auth.createUserWithEmailAndPassword(email, password);
      const uid = credenciales.user?.uid;
      const data: UserData = {
        email,
        usuario,
        uid: uid || ''
      };
      await this.db.collection('usuarios').doc(uid).set(data);
    } catch (error) {
      throw error; // Propagar el error para que el componente lo maneje
    }
  }

  // Método para obtener el estado de autenticación del usuario y redirigirlo a la página de inicio si no está autenticado.
  async isAuthenticated() {
    const user = await firstValueFrom(this.auth.authState);
    if (user) {
      return true;
    } else {
      this.router.navigate(['/']);
      return false;
    }
  }
  // Obtener TODOS los datos del usuario 
  async getUserData() {
    const user = await firstValueFrom(this.auth.authState);
    if (user) {
      const doc = await this.db.collection('usuarios').doc(user.uid).get().toPromise();
      if (doc && doc.exists) {
        return doc.data() as UserData;
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

}
