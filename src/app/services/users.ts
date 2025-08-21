import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class Users {
  
  constructor(private http: HttpClient) { }

  private apiUrl = 'https://ticketing-backend-50r0.onrender.com/users';

  // Get all users
  getUsers(): Observable<any> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get(`${this.apiUrl}`, { headers });
  }

  // Delete a user by ID
  deleteUser(userId: string): Observable<any> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.delete(`${this.apiUrl}/${userId}`, { headers });
  }
}
