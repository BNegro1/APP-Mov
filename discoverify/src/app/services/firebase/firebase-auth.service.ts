import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { from, Observable } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FirebaseAuthService {
  private apiUrl = 'https://firestore.googleapis.com/v1';
  private projectId = environment.firebase.projectId;

  constructor(
    private http: HttpClient,
    private auth: AngularFireAuth
  ) {}

  private async getIdToken(): Promise<string> {
    const user = await this.auth.currentUser;
    if (!user) {
      throw new Error('No user logged in');
    }
    return user.getIdToken();
  }

  private getHeaders(token: string): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Error en la petición:', error);
    if (error.status === 404) {
      console.error('Recurso no encontrado');
      // Intentar crear la colección si no existe
      return this.createInitialCollection();
    }
    throw error;
  }

  private createInitialCollection(): Observable<any> {
    return from(this.getIdToken()).pipe(
      switchMap(token => {
        const headers = this.getHeaders(token);
        const url = `${this.apiUrl}/projects/${this.projectId}/databases/(default)/documents`;
        const initialData = {
          collection: 'users',
          fields: {}
        };
        return this.http.post(url, initialData, { headers });
      })
    );
  }

  createUser(userData: any): Observable<any> {
    return from(this.getIdToken()).pipe(
      switchMap(token => {
        const headers = this.getHeaders(token);
        const url = `${this.apiUrl}/projects/${this.projectId}/databases/(default)/documents/users`;
        return this.http.post(url, userData, { headers }).pipe(
          catchError(error => this.handleError(error))
        );
      })
    );
  }

  updateUser(userId: string, userData: any): Observable<any> {
    return from(this.getIdToken()).pipe(
      switchMap(token => {
        const headers = this.getHeaders(token);
        const url = `${this.apiUrl}/projects/${this.projectId}/databases/(default)/documents/users/${userId}`;
        return this.http.patch(url, userData, { headers });
      })
    );
  }

  getUser(userId: string): Observable<any> {
    return from(this.getIdToken()).pipe(
      switchMap(token => {
        const headers = this.getHeaders(token);
        const url = `${this.apiUrl}/projects/${this.projectId}/databases/(default)/documents/users/${userId}`;
        return this.http.get(url, { headers });
      })
    );
  }
}
