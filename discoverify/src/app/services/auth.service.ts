import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Claves para almacenar el token de autenticación y el nombre de usuario en localStorage
  private readonly AUTH_TOKEN_KEY = 'tokenAuth';
  private readonly NOMBRE_USUARIO_KEY = 'username';
  
  // Estado de autenticación observable
  public authenticationState = new BehaviorSubject<boolean>(false);

  constructor() {
    // Actualiza el estado de autenticación al inicializar el servicio
    this.updateAuthenticationState();
  }

  // Actualiza el estado de autenticación basado en la existencia del token
  private updateAuthenticationState(): void {
    const tokenExists = this.isTokenStored();
    this.setAuthenticationState(tokenExists);
  }

  // Verifica si el token está almacenado en localStorage
  private isTokenStored(): boolean {
    const token = localStorage.getItem(this.AUTH_TOKEN_KEY);
    return !!token;
  }

  // Establece el estado de autenticación
  private setAuthenticationState(isAuthenticated: boolean): void {
    this.authenticationState.next(isAuthenticated);
  }

  // Inicia sesión almacenando las credenciales y actualizando el estado de autenticación
  public login(token: string, nombreUsuario: string): void {
    this.storeCredentials(token, nombreUsuario);
    this.setAuthenticationState(true);
  }

  // Almacena el token y el nombre de usuario en localStorage
  private storeCredentials(token: string, nombreUsuario: string): void {
    localStorage.setItem(this.AUTH_TOKEN_KEY, token);
    localStorage.setItem(this.NOMBRE_USUARIO_KEY, nombreUsuario);
  }

  // Obtiene el nombre de usuario almacenado en localStorage
  public getNombreUsuario(): string | null {
    return localStorage.getItem(this.NOMBRE_USUARIO_KEY);
  }

  // Verifica si el usuario está autenticado
  public isAuthenticated(): boolean {
    return this.authenticationState.value;
  }

  // Cierra sesión eliminando las credenciales y actualizando el estado de autenticación
  public logout(): void {
    this.clearCredentials();
    this.setAuthenticationState(false);
  }

  // Elimina el token y el nombre de usuario de localStorage
  private clearCredentials(): void {
    localStorage.removeItem(this.AUTH_TOKEN_KEY);
    localStorage.removeItem(this.NOMBRE_USUARIO_KEY);
  }
}