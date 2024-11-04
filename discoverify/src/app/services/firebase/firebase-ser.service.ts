import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { firstValueFrom, Observable, throwError } from 'rxjs';
import { FirebaseAuthService } from './firebase-auth.service';
import { catchError } from 'rxjs/operators';
import { Storage } from '@ionic/storage-angular';

interface UserData {
  email: string;
  usuario: string;
  uid: string;
  likedAlbums?: string[]; // Array para almacenar IDs de álbumes con like
  likesCount?: number;    // Contador de likes del usuario
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
    private firebaseAuthService: FirebaseAuthService,
    private storage: Storage

  ) {
    this.storage.create();
    // Definir la colección 'likes' con el tipo LikeData
    this.likesCollection = this.db.collection<LikeData>('likes');
  }

  private likesCollection;

  private handleFirebaseError(error: any): string {
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

    return errorMessage;
  }

  // Método mejorado de login con mejor manejo de errores
  async login(email: string, password: string) {
    try {
      // Intenta autenticar con Firebase
      const result = await this.auth.signInWithEmailAndPassword(email, password);
      if (result.user) {
        return result;
      }
      throw new Error('No se pudo iniciar sesión');
    } catch (error: any) {
      // Manejo específico de errores de autenticación
      let errorMessage = 'Error al iniciar sesión';
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        errorMessage = 'Correo o contraseña incorrectos';
      }
      throw new Error(errorMessage);
    }
  }

  // Limpiar storage
  async logout() {
    await this.auth.signOut(); // Cierra sesión en Firebase
    await this.storage.remove('SessionId'); // Limpia el storage local
    this.router.navigate(['/login'], { replaceUrl: true }); // Redirige evitando retorno
  }

  // Crear usuario en firebase, tanto en autenticación como en base de datos
  async register(email: string, password: string, usuario: string): Promise<true | string> {
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

        await batch.commit();
        return true;
      }
      throw new Error('No se pudo obtener el UID del usuario');
    } catch (error) {
      console.error('Error en el registro:', error);
      return this.handleFirebaseError(error);
    }
  }

  // Método para dar like a un álbum
  async addLike(albumId: string, userId: string): Promise<boolean> {
    try {
      const userRef = this.db.collection('usuarios').doc(userId);
      const userDoc = await firstValueFrom(userRef.get());
      
      if (userDoc.exists) {
        const userData = userDoc.data() as UserData;
        const likedAlbums = userData.likedAlbums || [];
        
        // Verificar si el álbum ya tiene like
        if (!likedAlbums.includes(albumId)) {
          // Actualizar el documento del usuario
          await userRef.update({
            likedAlbums: [...likedAlbums, albumId],
            likesCount: (userData.likesCount || 0) + 1
          });
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Error al dar like:', error);
      return false;
    }
  }

  // Método para quitar like de un álbum
  async removeLike(albumId: string, userId: string): Promise<boolean> {
    try {
      const userRef = this.db.collection('usuarios').doc(userId);
      const userDoc = await firstValueFrom(userRef.get());
      
      if (userDoc.exists) {
        const userData = userDoc.data() as UserData;
        const likedAlbums = userData.likedAlbums || [];
        
        if (likedAlbums.includes(albumId)) {
          const updatedLikes = likedAlbums.filter(id => id !== albumId);
          await userRef.update({
            likedAlbums: updatedLikes,
            likesCount: Math.max((userData.likesCount || 0) - 1, 0)
          });
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Error al quitar like:', error);
      return false;
    }
  }

  // Método para obtener el contador de likes del usuario
  async getUserLikesCount(userId: string): Promise<number> {
    try {
      const userDoc = await firstValueFrom(this.db.collection('usuarios').doc(userId).get());
      if (userDoc.exists) {
        const userData = userDoc.data() as UserData;
        return userData.likesCount || 0;
      }
      return 0;
    } catch (error) {
      console.error('Error al obtener likes:', error);
      return 0;
    }
  }

  // Método para verificar si un álbum tiene like del usuario
  async hasUserLikedAlbum(albumId: string, userId: string): Promise<boolean> {
    try {
      const userDoc = await firstValueFrom(this.db.collection('usuarios').doc(userId).get());
      if (userDoc.exists) {
        const userData = userDoc.data() as UserData;
        return (userData.likedAlbums || []).includes(albumId);
      }
      return false;
    } catch (error) {
      console.error('Error al verificar like:', error);
      return false;
    }
  }

  // Método para verificar el estado de autenticación y redirigir al login si no está autenticado
  async isAuthenticated() {
    const user = await firstValueFrom(this.auth.authState);
    if (user) {
      return true;
    } else {
      this.router.navigate(['/login']);
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

  // Método para guardar un álbum en Firestore
  saveAlbum(album: any): Promise<void> {
    const albumsCollection = this.db.collection('albums');
    return albumsCollection.add(album)
      .then(() => {
        console.log('Álbum guardado exitosamente');
      })
      .catch(error => {
        console.error('Error al guardar el álbum:', error);
      });
  }

  getAlbums(): Observable<any[]> {
    return this.db.collection('albums').valueChanges({ idField: 'id' });
  }

  // Método para observar el estado de autenticación
  getAuthState() {
    return this.auth.authState;
  }

}
