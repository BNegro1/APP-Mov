import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { Platform } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})


//        RE IMPLEMENTACIÓN DE SQL LITE!!!
//
// 
// 
// 
// (Finalmente)...

export class DbService {
  private database!: SQLiteObject;
  private isDbReady = new BehaviorSubject<boolean>(false);
  private listaUsuarios = new BehaviorSubject<any[]>([]);
  private likesCount = new BehaviorSubject<number>(0);

  constructor(private toastController: ToastController, private sqlite: SQLite, private platform: Platform) {
    this.crearBD();
  }

  crearBD() {
    this.platform.ready().then(() => {
      this.sqlite.create({
        name: 'discoverify.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        this.database = db;
        this.presentToast("Base de datos creada.");
        this.crearTablas();
      }).catch(e => this.presentToast(`Error al crear BD: ${e}`)); // Mostrar mensaje de error si falla la creación de la base de datos
    });
  }

  crearTablas() { // Crear tablas de la base de datos si no existen
    const query = `
      CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL,
        password TEXT NOT NULL,
        nombreUsuario TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS likes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER,
        albumId TEXT,
        FOREIGN KEY (userId) REFERENCES usuarios(id)
      );
    `;
    this.database.executeSql(query, []).then(() => {
      this.presentToast("Tablas creadas.");
      this.cargarUsuarios();
      this.isDbReady.next(true);
    }).catch(e => this.presentToast(`Error creando tablas: ${e}`)); // Mostrar mensaje de error si falla la creación de tablas
  }

  // Cargar usuarios de la tabla
  cargarUsuarios() { 
    const query = 'SELECT * FROM usuarios';
    this.database.executeSql(query, []).then(res => {
      const usuarios: any[] = [];
      for (let i = 0; i < res.rows.length; i++) {
        usuarios.push(res.rows.item(i));
      }
      this.listaUsuarios.next(usuarios); // Actualizar la lista de usuarios
    });
  }

  // Añadir un nuevo usuario
  async addUser(email: string, password: string, nombreUsuario: string) {
    const data = [email, password, nombreUsuario];
    await this.database.executeSql('INSERT INTO usuarios (email, password, nombreUsuario) VALUES (?, ?, ?)', data); // Insertar usuario en la base de datos, 
    //el significado de "VALUES (?, ?, ?)" es que se insertarán los valores de las variables data en el orden en que se encuentran.
    this.cargarUsuarios();
    this.presentToast('Usuario agregado'); 
  }

  // Validar si el usuario existe en la base de datos
  async validateUser(email: string, password: string): Promise<boolean> {
    const data = [email, password];
    const res = await this.database.executeSql('SELECT * FROM usuarios WHERE email = ? AND password = ?', data); // data es un array que contiene los valores de email y password
  
    if (res.rows.length > 0) {
      const user = res.rows.item(0);
      this.presentToast(`Bienvenido, ${user.nombreUsuario}`);
      return true;
    }
    return false;
  }

  // Comprobar si el correo ya existe
  async userExists(email: string): Promise<boolean> {
    const res = await this.database.executeSql('SELECT * FROM usuarios WHERE email = ?', [email]);
    return res.rows.length > 0;
  }

  // Actualizar datos del usuario
  async updateUser(id: number, email: string, password: string, nombreUsuario: string) {
    const data = [email, password, nombreUsuario, id];
    await this.database.executeSql('UPDATE usuarios SET email = ?, password = ?, nombreUsuario = ? WHERE id = ?', data);
    this.cargarUsuarios();
    this.presentToast('Usuario actualizado');
  }

  // Método para actualizar la contraseña de un usuario por correo
  async updateUserPassword(email: string, newPassword: string): Promise<void> {
    const data = [newPassword, email];
    await this.database.executeSql('UPDATE usuarios SET password = ? WHERE email = ?', data);
  }

  // Dar like a un álbum
  async likeAlbum(userId: string, albumId: string) {
    const data = [userId, albumId];
    await this.database.executeSql('INSERT INTO likes (userId, albumId) VALUES (?, ?)', data);
    this.updateLikesCount(userId);
  }

  // Dar dislike a un álbum
  async dislikeAlbum(userId: string, albumId: string) {
    await this.database.executeSql('DELETE FROM likes WHERE userId = ? AND albumId = ?', [userId, albumId]);
    this.updateLikesCount(userId);
  }

  // Obtener álbumes con "like"
  async getLikedAlbums(userId: string): Promise<string[]> {
    const data = [userId];
    const res = await this.database.executeSql('SELECT albumId FROM likes WHERE userId = ?', data);
    const likedAlbums: string[] = [];
    for (let i = 0; i < res.rows.length; i++) {
      likedAlbums.push(res.rows.item(i).albumId);
    }
    return likedAlbums;
  }

  // Actualizar contador de likes
  async updateLikesCount(userId: string) {
    const likedAlbums = await this.getLikedAlbums(userId);
    this.likesCount.next(likedAlbums.length);
  }

  // Estado de la base de datos
  dbState(): Observable<boolean> {
    return this.isDbReady.asObservable();
  }

  // Contador de likes
  getLikesCount(): Observable<number> {
    return this.likesCount.asObservable();
  }

  // Toast para mostrar mensajes en la aplicación
  async presentToast(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 3000,
    });
    toast.present();
  }
}
