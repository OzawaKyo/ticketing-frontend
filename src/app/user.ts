import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap, map, of, shareReplay, finalize } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class User {
  private apiUrl = 'https://ticketing-backend-50r0.onrender.com';

  // Cache du rôle utilisateur pour éviter des requêtes répétées
  private cachedRole: string | null = null;
  private roleRequest$: Observable<string> | null = null;

  constructor(private http: HttpClient) { }

  getUserProfile(): Observable<any> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get(`${this.apiUrl}/profile`, { headers }).pipe(
      tap(() => {})
    );
  }

  // Récupère le rôle utilisateur avec mise en cache (mémoïsation)
  getUserRole(): Observable<string> {
    if (this.cachedRole) {
      return of(this.cachedRole);
    }
    if (this.roleRequest$) {
      return this.roleRequest$;
    }

    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

    this.roleRequest$ = this.http.get(`${this.apiUrl}/profile`, { headers }).pipe(
      map((response: any) => response.role as string),
      tap(role => { this.cachedRole = role; }),
      shareReplay(1),
      finalize(() => { this.roleRequest$ = null; })
    );

    return this.roleRequest$;
  }

  // Permet de réinitialiser le cache (à appeler lors du logout si nécessaire)
  clearRoleCache(): void {
    this.cachedRole = null;
    this.roleRequest$ = null;
  }
}
