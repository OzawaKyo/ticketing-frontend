import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Auth {

  private apiUrl = 'https://ticketing-backend-50r0.onrender.com/auth';

  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((response: any) => {
        localStorage.setItem('access_token', response.access_token);
      })
    );
  }

  register(prenom: string, nom: string, email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, { prenom, nom, email, password });
  }
}


