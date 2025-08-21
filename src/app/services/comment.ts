import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class Comment {
  
  constructor(private http: HttpClient) { }

  private apiUrl = 'https://ticketing-backend-50r0.onrender.com/comments';

  // Create a new comment
  createComment(ticketId: string, content: string): Observable<any> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    const commentData = { content };
    return this.http.post(`${this.apiUrl}?ticketId=${ticketId}`, commentData, { headers });
  }
}
