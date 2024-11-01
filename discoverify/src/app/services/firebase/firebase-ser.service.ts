import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { firstValueFrom, Observable, throwError } from 'rxjs';
import { FirebaseAuthService } from './firebase-auth.service';
import { catchError } from 'rxjs/operators';

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

  }
  

  constructor(
    
    private auth: AngularFireAuth,
    private db: AngularFirestore,
    private router: Router,
    private firebaseAuthService: FirebaseAuthService

  ) { 
    // Definir la colección 'likes' con el tipo LikeData
    this.likesCollection = this.db.collection<LikeData>('likes');
  }

  private likesCollection;

  private handleFirebaseError(error: any) {
    console.error('Error en Firebase:', error);
    let errorMessage = 'Ocurrió un error desconocido';
    
    if (error.code) {
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'El correo electrónico ya está en uso';
          break;
        case 'auth/weak-password':
          errorMessage = 'La contraseña es demasiado débil';
          break;
        case 'auth/invalid-email':
          errorMessage = 'El correo electrónico no es válido';
          break;
        case 'permission-denied':
          errorMessage = 'No tienes permisos para realizar esta acción';
          break;
        default:
          errorMessage = error.message;
      }
    }
    
    return throwError(() => errorMessage);
  }

  // Método de inicio de sesión
  login(email: string, password: string) {
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  // Cerrar sesión y redirigir al inicio
  logout() {
    this.auth.signOut();
    this.router.navigate(['/']);
  }

  // Crear usuario en firebase, tanto en autenticación como en base de datos
  async register(email: string, password: string, usuario: string): Promise<true | Observable<never>> {
    try {
      const existingUser = await this.auth.fetchSignInMethodsForEmail(email);
      if (existingUser.length > 0) {
        throw { code: 'auth/email-already-in-use' };
      }
      const credentials = await this.auth.createUserWithEmailAndPassword(email, password);
      const uid = credentials.user?.uid;
      
      if (uid) {
        const batch = this.db.firestore.batch();
        
        // Crear documento en la colección 'usuarios'
        const usuarioRef = this.db.collection('usuarios').doc(uid).ref;
        batch.set(usuarioRef, {
          email: email,
          usuario: usuario,
          uid: uid,
          createdAt: new Date()
        });

        // Crear documento en la colección 'users' (si es necesario)
        const userRef = this.db.collection('users').doc(uid).ref;
        batch.set(userRef, {
          email: email,
          usuario: usuario,
          uid: uid,
          createdAt: new Date()
        });

        await batch.commit();
        return true;
      }
      throw new Error('No se pudo obtener el UID del usuario');
    } catch (error) {
      console.error('Error en el registro:', error);
      return this.handleFirebaseError(error);
    }
  }

  // Método para verificar el estado de autenticación y redirigir al inicio si no está autenticado
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

  // Incrementar likes para un elemento de forma segura usando transacción
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

  // Obtener contador de likes para un elemento usando firstValueFrom
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
