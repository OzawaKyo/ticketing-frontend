import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';

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
    MatCardModule
  ],
  templateUrl: './ticket-table.html',
  styleUrls: ['./ticket-table.css']
})
export class TicketTableComponent implements OnInit {
  @Input() tickets: Ticket[] = [];

  displayedColumns: string[] = ['id', 'title', 'status', 'createdBy', 'assignedTo', 'createdAt', 'actions'];

  ngOnInit() {
    // Si aucun ticket n'est fourni, on utilise des données de test
    if (this.tickets.length === 0) {
      this.tickets = [
        {
          id: 1,
          title: "testing ticket",
          description: "this is a testing ticket to see if the ticket entity is working well",
          status: "in_progress",
          createdBy: {
            id: 15,
            prenom: "mohamed",
            nom: "amarcha",
            email: "mohamed@amarcha.com",
            role: "user",
            createdAt: "2025-08-05T11:38:56.182Z",
            updatedAt: "2025-08-05T11:38:56.182Z"
          },
          assignedTo: null,
          createdAt: "2025-08-06T15:12:21.706Z",
          updatedAt: "2025-08-06T15:35:21.496Z",
          comments: []
        },
        {
          id: 2,
          title: "Bug fix urgent",
          description: "Correction d'un bug critique sur la page de connexion",
          status: "open",
          createdBy: {
            id: 16,
            prenom: "sarah",
            nom: "dupont",
            email: "sarah@dupont.com",
            role: "user",
            createdAt: "2025-08-05T10:30:00.000Z",
            updatedAt: "2025-08-05T10:30:00.000Z"
          },
          assignedTo: {
            id: 20,
            prenom: "alex",
            nom: "martin",
            email: "alex@martin.com",
            role: "admin"
          },
          createdAt: "2025-08-06T10:00:00.000Z",
          updatedAt: "2025-08-06T10:00:00.000Z",
          comments: []
        },
        {
          id: 3,
          title: "Nouvelle fonctionnalité",
          description: "Ajout d'une nouvelle fonctionnalité de notification",
          status: "closed",
          createdBy: {
            id: 17,
            prenom: "jean",
            nom: "martin",
            email: "jean@martin.com",
            role: "user",
            createdAt: "2025-08-04T14:20:00.000Z",
            updatedAt: "2025-08-04T14:20:00.000Z"
          },
          assignedTo: {
            id: 21,
            prenom: "marie",
            nom: "dubois",
            email: "marie@dubois.com",
            role: "admin"
          },
          createdAt: "2025-08-05T09:15:00.000Z",
          updatedAt: "2025-08-06T16:45:00.000Z",
          comments: []
        }
      ];
    }
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
    console.log('Voir le ticket:', ticket);
    // Ici vous pouvez implémenter la navigation vers les détails du ticket
  }

  editTicket(ticket: Ticket) {
    console.log('Éditer le ticket:', ticket);
    // Ici vous pouvez implémenter la logique d'édition
  }
}
