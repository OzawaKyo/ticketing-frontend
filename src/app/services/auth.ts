import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { User } from '../user';

@Injectable({
  providedIn: 'root'
})
export class Auth {

  private apiUrl = 'https://ticketing-backend-50r0.onrender.com/auth';

  constructor(private http: HttpClient, private router: Router, private userService: User) { }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((response: any) => {
        localStorage.setItem('access_token', response.access_token);
        this.userService.clearRoleCache();
      })
    );
  }

  register(prenom: string, nom: string, email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, { prenom, nom, email, password }).pipe(
      tap((response: any) => {
        localStorage.setItem('access_token', response.access_token);
        this.userService.clearRoleCache();
      })
    );
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = localStorage.getItem('access_token');
    if (!token) {
      return false;
    }
    
    // Vérification basique de la présence du token
    // Le backend ne fournit pas d'endpoint de vérification, 
    // donc on se base sur la présence du token
    // L'interceptor gérera les cas où le token est expiré
    return true;
  }

  // Get the current access token
  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  // Logout user
  logout(): void {
    localStorage.removeItem('access_token');
    this.userService.clearRoleCache();
    console.log('Utilisateur déconnecté');
    this.router.navigate(['/login']);
  }
}


