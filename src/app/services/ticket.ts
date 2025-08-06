import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Ticket {
  private apiUrl = 'https://ticketing-backend-50r0.onrender.com/tickets';
  
  constructor(private http: HttpClient) { }

  // Create a new ticket
  createTicket(title: string, description: string): Observable<any> {
    const ticketData = { title, description };
    return this.http.post(`${this.apiUrl}`, ticketData);
  }

  // Get all tickets
  getTickets(): Observable<any> {
    return this.http.get(`${this.apiUrl}`);
  }

  // Get a ticket by ID
  getTicketById(ticketId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${ticketId}`);
  }

  // Update a ticket by ID
  updateTicket(ticketId: string, title: string, description: string, status: string, assignedTo: string): Observable<any> {
    const ticketData = { title, description, status, assignedTo };
    return this.http.put(`${this.apiUrl}/${ticketId}`, ticketData);
  }

  // Delete a ticket by ID
  deleteTicket(ticketId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${ticketId}`);
  }


}

  
