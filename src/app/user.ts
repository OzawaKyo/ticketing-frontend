import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, tap, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class User {
    private apiUrl = 'https://ticketing-backend-50r0.onrender.com';

    constructor(private http: HttpClient) { }

    getUserProfile(): Observable<any> {
        const token = localStorage.getItem('access_token');
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });

        return this.http.get(`${this.apiUrl}/profile`, { headers }).pipe(
            tap((response: any) => {
            })
        );
    }

    getUserRole(): Observable<any> {
        const token = localStorage.getItem('access_token');
        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });

        return this.http.get(`${this.apiUrl}/profile`, { headers }).pipe(
            map((response: any) => response.role),
            tap((role: any) => {
            })
        );
    }
  }
