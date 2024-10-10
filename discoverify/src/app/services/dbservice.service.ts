import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { Platform, ToastController } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DbService {
  private database!: SQLiteObject;
  private isDbReady = new BehaviorSubject<boolean>(false);
  private listaUsuarios = new BehaviorSubject<any[]>([]);

  private tblUsuarios: string = `CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT
  );`;

  constructor(
    private sqlite: SQLite,
    private platform: Platform,
    private toastController: ToastController
  ) {
    this.crearBD();
  }

  // Crear la base de datos
  crearBD() {
    this.platform.ready().then(() => {
      this.sqlite
        .create({
          name: 'usuarios.db',
          location: 'default',
        })
        .then((db: SQLiteObject) => {
          this.database = db;
          this.presentToast('Base de datos creada');
          this.crearTablas();
        })
        .catch((error) =>
          this.presentToast('Error creando la base de datos: ' + error)
        );
    });
  }

  //  que crea la tabla de usuarios SI NO EXISTE.
  async crearTablas() {
    try {
      await this.database.executeSql(this.tblUsuarios, []);
      this.presentToast('Tabla de usuarios creada');
      this.cargarUsuarios();
      this.isDbReady.next(true);
    } catch (error) {
      this.presentToast('Error en Crear Tabla: ' + error);
    }
  }

  //  para cargar todos los usuarios de la tabla
  cargarUsuarios() {
    let usuarios: any[] = [];
    this.database
      .executeSql('SELECT * FROM usuarios', [])
      .then((res) => {

        if (res.rows.length > 0) {

          for (let i = 0; i < res.rows.length; i++) {
            usuarios.push({
              id: res.rows.item(i).id,
              email: res.rows.item(i).email,
              password: res.rows.item(i).password,
            });
          }


        }
        this.listaUsuarios.next(usuarios);
      })
      .catch((error) => this.presentToast('Error cargando usuarios: ' + error));
  }


  // Insertar un nuevo usuario
  async addUser(email: string, password: string) {
    let data = [email, password];
    try {
      await this.database.executeSql(
        'INSERT INTO usuarios (email, password) VALUES (?, ?)',
        data
      );
      this.presentToast('Usuario agregado');
      this.cargarUsuarios();
    } catch (error) {
      this.presentToast('Error insertando usuario: ' + error);
    }
  }

  // Validar si el usuario existe con correo y contraseña
  async validateUser(email: string, password: string): Promise<boolean> {
    const query = `SELECT * FROM usuarios WHERE email = ? AND password = ?`;
    try {
      const result = await this.database.executeSql(query, [email, password]);
      return result.rows.length > 0;
    } catch (error) {
      console.error('Error validando usuario: ', error);
      return false;
    }
  }
  // dbservice.service.ts -> verificar si el correo ya existe
  async userExists(email: string): Promise<boolean> {
    const query = `SELECT * FROM usuarios WHERE email = ?`;
    try {
      const result = await this.database.executeSql(query, [email]);
      return result.rows.length > 0;
    } catch (error) {
      console.error('Error verificando si el usuario existe: ', error);
      return false;
    }
  }

  // Actualizar un usuario existente
  async updateUser(id: number, email: string, password: string) {
    let data = [email, password, id];

    try {
      await this.database.executeSql(
        'UPDATE usuarios SET email=?, password=? WHERE id=?',
        data
      );
      this.presentToast('Usuario actualizado');
      this.cargarUsuarios();
    } 
    
    catch (error) {
      this.presentToast('Error actualizando usuario: ' + error);
    }
  }


  // Eliminar un usuario por !! ID !!
  async deleteUser(id: number) {
    try {
      await this.database.executeSql('DELETE FROM usuarios WHERE id=?', [id]);
      this.presentToast('Usuario eliminado');
      this.cargarUsuarios();
    } catch (error) {
      this.presentToast('Error eliminando usuario: ' + error);
    }
  }

  // Observador -> aquí verificamos el estado de la BD
  dbState(): Observable<boolean> {
    return this.isDbReady.asObservable();
  }


  // Mostrar mensajes mediante toast
  async presentToast(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 3000,
    });
    toast.present();
  }
}
