import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

  // EN el codigo original, la clase se llama AuthService, pero en este caso se llama DbService
  // Esto es porque el código original ya tiene un servicio llamado AuthService, y bueno,  este código
  // es un servicio nuevo que se está creando, y se cambnio el nombre
  // para evitar conflictos con el servicio ya existente.

  // Suena redundante, pero este servicio se encarga de la interacción con la base de datos al fin y al cabo.
  // En este caso, la base de datos es localStorage, que se está almacenando con los datos en el navegador.
  // Este servicio se encarga de manejar los datos de los usuarios en localStorage, como agregar, eliminar
  // y actualizar usuarios, y verificar si un usuario ya existe en la base de datos.

  // No se elimino el servicio AuthService original, ya que este servicio es diferente y se encarga de
  // la autenticación de los usuarios, mientras que este servicio se encarga de la interacción con la base de datos.


export class DbService {
  private isDbReady = new BehaviorSubject<boolean>(false);
  private listaUsuarios = new BehaviorSubject<any[]>([]);
  private likesCount = new BehaviorSubject<number>(0);

  constructor(private toastController: ToastController) {
    this.initStorage();
  }

  private initStorage() {
    if (typeof (Storage) !== "undefined") {
      if (!localStorage.getItem('usuarios')) {
        localStorage.setItem('usuarios', JSON.stringify([]));
      }
      this.cargarUsuarios();
      this.isDbReady.next(true);
    } else {
      console.error('LocalStorage no está disponible en este navegador.'); // Si el navegador no soporta localStorage, se muestra un mensaje de error en la consola
    }
  }

  cargarUsuarios() {
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]'); // Se obtienen los usuarios almacenados en localStorage
    this.listaUsuarios.next(usuarios);
  }

  // Método para dar like a un álbum
  likeAlbum(userId: string, albumId: string): void {
    const likes = JSON.parse(localStorage.getItem('likes') || '{}');
    if (!likes[userId]) {
      likes[userId] = [];
    }
    if (!likes[userId].includes(albumId)) {
      likes[userId].push(albumId);
    }
    localStorage.setItem('likes', JSON.stringify(likes));
    this.updateLikesCount(userId);
  }

  // Método para dar dislike a un álbum
  dislikeAlbum(userId: string, albumId: string): void {
    const dislikes = JSON.parse(localStorage.getItem('dislikes') || '{}');
    if (!dislikes[userId]) {
      dislikes[userId] = [];
    }
    if (!dislikes[userId].includes(albumId)) {
      dislikes[userId].push(albumId);
    }
    localStorage.setItem('dislikes', JSON.stringify(dislikes));
    this.updateLikesCount(userId);
  }

  getLikedAlbums(userId: string): string[] {
    const likes = JSON.parse(localStorage.getItem('likes') || '{}');
    return likes[userId] || [];
  }

  getDislikedAlbums(userId: string): string[] {
    const dislikes = JSON.parse(localStorage.getItem('dislikes') || '{}');
    return dislikes[userId] || [];
  }

  updateLikesCount(userId: string): void {  // Actualizar el contador de likes
    const likedAlbums = this.getLikedAlbums(userId);
    this.likesCount.next(likedAlbums.length);
  }

  addUser(email: string, password: string, nombreUsuario: string): Promise<void> {
    return new Promise((resolve, reject) => { // Se devuelve una promesa que se resuelve o se rechaza
      const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
      const newUser = { id: Date.now(), email, password, nombreUsuario };
      usuarios.push(newUser); // Se agrega un nuevo usuario al array de usuarios
      localStorage.setItem('usuarios', JSON.stringify(usuarios));
      this.cargarUsuarios();
      resolve(); // Se resuelve la promesa
    });
  }

  validateUser(email: string, password: string): Promise<boolean> {
    return new Promise((resolve) => {
      const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
      const user = usuarios.find((u: any) => u.email === email && u.password === password); // Se busca un usuario con el correo electrónico y la contraseña proporcionados
      if (user) {
        this.presentToast(`Bienvenido, ${user.nombreUsuario}`); // Si el usuario es válido, se muestra un mensaje de bienvenida
      }
      resolve(!!user); // Se resuelve la promesa con un valor booleano, "!!" convierte el valor a un booleano por su operador de negación doble.
    });
  }

  userExists(email: string): Promise<boolean> { // Se define el método userExists que recibe un correo electrónico y devuelve una promesa con un valor booleano
    return new Promise((resolve) => {
      const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]'); // Lo mismo que antes, se obtienen los usuarios almacenados en localStorage y se convierten a un array.
      const exists = usuarios.some((u: any) => u.email === email);
      resolve(exists);
    });
  }

  // EVALUAR IMPLEMENTACIÓN
  // Se define el método updateUser que recibe un id, un correo electrónico, una contraseña y un nombre de usuario y devuelve una promesa sin valor
  // Si bien se define el método, no se utiliza en el código proporcionado, por lo que no se puede evaluar su implementación :cc (pero hay que ver que onda)

  updateUser(id: number, email: string, password: string, nombreUsuario: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
      const index = usuarios.findIndex((u: any) => u.id === id);
      if (index !== -1) {
        usuarios[index] = { ...usuarios[index], email, password, nombreUsuario };
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
        this.presentToast('Usuario actualizado exitosamente'); // Si el usuario se actualiza correctamente, se muestra un mensaje de éxito
        this.cargarUsuarios();
        resolve();
      } else {
        reject(new Error('Usuario no encontrado'));
      }
    });
  }

  deleteUser(id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
      const filteredUsers = usuarios.filter((u: any) => u.id !== id);
      localStorage.setItem('usuarios', JSON.stringify(filteredUsers));
      this.presentToast('Usuario eliminado');
      this.cargarUsuarios();
      resolve();
    });
  }

  dbState(): Observable<boolean> { // Se define el método dbState que devuelve un observable de tipo booleano 
    // que emite el estado de la base de datos.
    return this.isDbReady.asObservable();
  }

  // De la misma forma de antes, aqui se define el método para los getLikesCount que devuelve un observable de tipo número.
  getLikesCount(): Observable<number> {
    return this.likesCount.asObservable();
  }

  // Toast final para mostrar mensajes en la aplicación.
  async presentToast(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 3000,
    });
    toast.present();
  }
}