import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable({
  providedIn: 'root',
})

// Datos de Auth para API de Spotify
// https://developer.spotify.com/
// Documentaicón: https://developer.spotify.com/documentation/web-api
// Dashboard: https://developer.spotify.com/dashboard
export class SpotifyAuthService {
  private clientId = '3881fb07520a491f9090ad3ebc97ccb8';
  private clientSecret = '90bdd6d2ad06437185aa0eeda7bb1fc8';
  private tokenUrl = 'https://accounts.spotify.com/api/token';
  private accessToken: string = '';

  constructor() {}

  async getAccessToken(): Promise<string> {
    if (this.accessToken) {
      return this.accessToken; // AccesToken retorna SOLO si está disponible.
    }

    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${btoa(this.clientId + ':' + this.clientSecret)}`,
    };

    const body = 'grant_type=client_credentials';

    try {
      const response = await axios.post(this.tokenUrl, body, { headers });
      this.accessToken = response.data.access_token;
      return this.accessToken;
    } catch (error) {
      console.error('Error al acceder al token, desc. error:', error);
      throw new Error('No se puede acceder al token especificado');
    }
  }
}
