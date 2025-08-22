import { Component, Input, OnInit, Output, EventEmitter, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Ticket as TicketService } from '../../services/ticket';
import { Router } from '@angular/router';
import { StatusChangeConfirmationDialog } from '../../shared/dialogs/status-change-confirmation-dialog.component';     

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
    MatProgressSpinnerModule,
    MatDialogModule
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

  constructor(private ticketService: TicketService, private router: Router, private dialog: MatDialog) {}

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

  toggleTicketStatus(ticket: Ticket) {
    const currentStatus = ticket.status.toLowerCase();
    let newStatus: string;
    let statusText: string;

    // Définir le prochain statut dans le cycle
    switch (currentStatus) {
      case 'open':
        newStatus = 'in_progress';
        statusText = 'En cours';
        break;
      case 'in_progress':
        newStatus = 'closed';
        statusText = 'Fermé';
        break;
      case 'closed':
        newStatus = 'open';
        statusText = 'Ouvert';
        break;
      default:
        newStatus = 'open';
        statusText = 'Ouvert';
    }

    // Ouvrir la boîte de dialogue de confirmation
    const dialogRef = this.dialog.open(StatusChangeConfirmationDialog, {
      width: '400px',
      panelClass: 'custom-dialog-container',
      data: {
        ticketTitle: ticket.title,
        currentStatus: this.getStatusText(ticket.status),
        newStatus: statusText
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.performStatusChange(ticket, newStatus);
      }
    });
  }

  private performStatusChange(ticket: Ticket, newStatus: string) {
    // Appel à l'API pour mettre à jour le statut
    this.ticketService.updateTicketStatus(ticket.id.toString(), newStatus).subscribe({
      next: () => {
        console.log('Statut du ticket mis à jour avec succès');
        // Mettre à jour le ticket localement
        ticket.status = newStatus;
      },
      error: (error) => {
        console.error('Erreur lors de la mise à jour du statut:', error);
        // Ici vous pourriez afficher un message d'erreur à l'utilisateur
      }
    });
  }
}

