import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class Ticket {
  private apiUrl = 'https://ticketing-backend-50r0.onrender.com/tickets';

  constructor(private http: HttpClient) { }

  // Create a new ticket
  createTicket(title: string, description: string): Observable<any> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    const ticketData = { title, description };
    return this.http.post(`${this.apiUrl}`, ticketData, { headers });
  }

  // Get all tickets
  getTickets(): Observable<any> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get(`${this.apiUrl}`, { headers });
  }

  // Get a ticket by ID
  getTicketById(ticketId: string): Observable<any> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get(`${this.apiUrl}/${ticketId}`, { headers });
  }

  // Update a ticket by ID
  updateTicket(ticketId: string, title: string, description: string, status: string, assignedTo: string): Observable<any> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    const ticketData = { title, description, status, assignedTo };
    return this.http.put(`${this.apiUrl}/${ticketId}`, ticketData, { headers });
  }

  // Delete a ticket by ID
  deleteTicket(ticketId: string): Observable<any> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.delete(`${this.apiUrl}/${ticketId}`, { headers });
  }

  // Update ticket status only
  updateTicketStatus(ticketId: string, status: string): Observable<any> {
    const token = localStorage.getItem('access_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    const statusData = { status };
    return this.http.put(`${this.apiUrl}/${ticketId}`, statusData, { headers });
  }

}


