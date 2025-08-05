import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class Auth {

  private apiUrl = 'https://ticketing-backend-50r0.onrender.com/auth';

  constructor(private http: HttpClient, private router: Router) { }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((response: any) => {
        localStorage.setItem('access_token', response.access_token);
      })
    );
  }

  register(prenom: string, nom: string, email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, { prenom, nom, email, password }).pipe(
      tap((response: any) => {
        localStorage.setItem('access_token', response.access_token);
      })
    );
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = localStorage.getItem('access_token');
    return !!token;
  }

  // Get the current access token
  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  // Logout user
  logout(): void {
    localStorage.removeItem('access_token');
    this.router.navigate(['/homepage']);

  }
}


