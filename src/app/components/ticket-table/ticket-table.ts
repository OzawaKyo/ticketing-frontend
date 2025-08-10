import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Ticket as TicketService } from '../../services/ticket';
import { Router } from '@angular/router';     

export interface Ticket {
  id: number;
  title: string;
  description: string;
  status: string;
  createdBy: {
    id: number;
    prenom: string;
    nom: string;
    email: string;
    role: string;
    createdAt: string;
    updatedAt: string;
  };
  assignedTo: any;
  createdAt: string;
  updatedAt: string;
  comments: any[];
}

@Component({
  selector: 'app-ticket-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatChipsModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatCardModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './ticket-table.html',
  styleUrls: ['./ticket-table.css']
})
export class TicketTableComponent implements OnInit {
  @Input() tickets: Ticket[] = [];
  @Output() ticketSelected = new EventEmitter<number>();
  isLoading: boolean = false;
  error: string | null = null;

  displayedColumns: string[] = ['id', 'title', 'status', 'createdBy', 'assignedTo', 'createdAt', 'actions'];

  constructor(private ticketService: TicketService, private router: Router) {}

  ngOnInit() {
    this.loadTickets();
  }

  loadTickets() {
    // Si des tickets sont fournis en input, les utiliser
    if (this.tickets.length > 0) {
      return;
    }

    this.isLoading = true;
    this.error = null;

    this.ticketService.getTickets().subscribe({
      next: (response) => {
        this.tickets = response;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des tickets:', error);
        this.error = 'Erreur lors du chargement des tickets';
        this.isLoading = false;
      }
    });
  }

  getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'open':
        return 'primary';
      case 'in_progress':
        return 'accent';
      case 'closed':
        return 'warn';
      default:
        return '';
    }
  }

  getStatusText(status: string): string {
    switch (status.toLowerCase()) {
      case 'open':
        return 'Ouvert';
      case 'in_progress':
        return 'En cours';
      case 'closed':
        return 'Fermé';
      default:
        return status;
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  viewTicket(ticket: Ticket) {
    this.ticketSelected.emit(ticket.id);
  }

  editTicket(ticket: Ticket) {
    this.router.navigate(['/tickets', ticket.id, 'edit']);
  }
}

