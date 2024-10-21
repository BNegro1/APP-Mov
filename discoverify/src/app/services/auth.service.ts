import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SQLite, SQLiteObject } from '@awesome-cordova-plugins/sqlite/ngx';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})

// Se RE IMPLEMENTA auth.service.ts CON SQL LITE (otra vez)

export class AuthService {
  // Claves para almacenar el token de autenticación y el nombre de usuario en SQLite
  private readonly AUTH_TOKEN_KEY = 'tokenAuth';
  private readonly NOMBRE_USUARIO_KEY = 'username';

  private database!: SQLiteObject;

  // Estado de autenticación observable
  public authenticationState = new BehaviorSubject<boolean>(false);

  constructor(private sqlite: SQLite, private platform: Platform) {
    // Inicializar la base de datos y actualizar el estado de autenticación
    this.initDatabase();
  }

  // Inicializa la base de datos
  private initDatabase(): void {
    this.platform.ready().then(() => {
      this.sqlite.create({
        name: 'auth.db',
        location: 'default'
      }).then((db: SQLiteObject) => {
        this.database = db;
        this.createAuthTable();
      }).catch(e => console.error('Error al crear la base de datos:', e));
    });
  }

  // Crea la tabla de autenticación si no existe
  private createAuthTable(): void {
    const query = `
      CREATE TABLE IF NOT EXISTS auth (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        token TEXT,
        nombreUsuario TEXT
      );
    `;
    this.database.executeSql(query, []).then(() => {
      this.updateAuthenticationState();
    }).catch(e => console.error('Error al crear la tabla de autenticación:', e));
  }

  // Actualiza el estado de autenticación basado en la existencia del token
  private updateAuthenticationState(): void {
    this.isTokenStored().then(tokenExists => {
      this.setAuthenticationState(tokenExists);
    });
  }

  // Verifica si el token está almacenado.
  // Este método es privado porque solo se utiliza internamente para actualizar el estado de autenticación.
  private async isTokenStored(): Promise<boolean> {
    const query = 'SELECT token FROM auth LIMIT 1';
    const res = await this.database.executeSql(query, []);
    return res.rows.length > 0;
  }

  // Establece el estado de autenticación !!! 
  // Se hace de la siguietne forma:
  // 1. Se crea un método privado setAuthenticationState que recibe un booleano isAuthenticated y actualiza el valor del BehaviorSubject authenticationState.
  // 2. Se llama a este método desde los métodos login y logout para actualizar el estado de autenticación.
  private setAuthenticationState(isAuthenticated: boolean): void {
    this.authenticationState.next(isAuthenticated);
  }

  // Inicia sesión almacenando las credenciales y actualizando el estado de autenticación
  public async login(token: string, nombreUsuario: string): Promise<void> {
    await this.storeCredentials(token, nombreUsuario);
    this.setAuthenticationState(true);
  }

  // Almacena el token y el nombre de usuario
  private async storeCredentials(token: string, nombreUsuario: string): Promise<void> {
    const query = 'INSERT INTO auth (token, nombreUsuario) VALUES (?, ?)';
    await this.database.executeSql(query, [token, nombreUsuario]);
  }

  // Obtiene el nombre de usuario almacenado en SQLite
  public getNombreUsuario(): Promise<string | null> {
    return this.database.executeSql('SELECT nombreUsuario FROM auth LIMIT 1')
      .then(res => res.rows.length > 0 ? res.rows.item(0).nombreUsuario : null);
  }


  // Verifica si el usuario está autenticado
  public isAuthenticated(): boolean {
    return this.authenticationState.value;
  }

  // Cierra sesión eliminando las credenciales y actualizando el estado de autenticación
  public async logout(): Promise<void> {
    await this.clearCredentials();
    this.setAuthenticationState(false);
  }

  // Elimina el token y el nombre de usuario de SQLite
  private async clearCredentials(): Promise<void> {
    const query = 'DELETE FROM auth';
    await this.database.executeSql(query, []);
  }
}
