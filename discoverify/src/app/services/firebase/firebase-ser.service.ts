import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

interface UserData {
  email: string;
  usuario: string;
  uid: string;
}

interface LikeData {
  count: number;
}

@Injectable({
  providedIn: 'root'
})

export class FirebaseLoginService {
  changePassword(oldPassword: string, newPassword: string) {
    throw new Error('Method not implemented.');
  }
  

  constructor(
    
    private auth: AngularFireAuth,
    private db: AngularFirestore,
    private router: Router

  ) { 
    // Definir la colección 'likes' con el tipo LikeData
    this.likesCollection = this.db.collection<LikeData>('likes');
  }

  private likesCollection;

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
      const doc = await firstValueFrom(this.db.collection('usuarios').doc(user.uid).get());
      if (doc && doc.exists) {
        return doc.data() as UserData;
      } else {
        return null;
      }
    } else {
      return null;
    }
  }

  // Incrementar likes para un ítem de forma segura usando transacción
  async addLike(itemId: string) {
    const likeRef = this.likesCollection.doc(itemId).ref;
    await this.db.firestore.runTransaction(async (transaction) => {
      const doc = await transaction.get(likeRef);
      if (doc.exists) {
        const data = doc.data() as LikeData;
        const currentLikes = data.count || 0;
        transaction.update(likeRef, { count: currentLikes + 1 });
      } else {
        transaction.set(likeRef, { count: 1 });
      }
    });
  }

  // Obtener conteo de likes para un ítem usando firstValueFrom
  async getLikes(itemId: string): Promise<number> {
    const doc = await firstValueFrom(this.likesCollection.doc(itemId).get());
    if (doc.exists) {
      const data = doc.data() as LikeData;
      return data.count || 0;
    } else {
      return 0;
    }
  }

}
