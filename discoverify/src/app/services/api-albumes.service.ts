import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // Importar el modulo HttpClient (para realizar consultas HTTP)
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiAlbumesService {

  // Establecer la URL de la API de MusicBrainz:
  apiURL = 'https://musicbrainz.org/ws/2/release-group/?query=artist:queen&fmt=json';
 
  constructor(private http: HttpClient) {} // Inyectar el servicio HttpClient

  getAlbumes(): Observable<any> { // Metodo para obtener los albumes de la API
    return this.http.get(this.apiURL);
  }
}