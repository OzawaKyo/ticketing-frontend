import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router } from '@angular/router';
import { Ticket } from '../../services/ticket';

@Component({
  selector: 'app-view-ticket',
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, MatProgressSpinnerModule],
  templateUrl: './view-ticket.html',
  styleUrls: ['./view-ticket.css']
})
export class ViewTicket {
  isLoading = true;
  error: string | null = null;
  ticket: any = null;
  private ticketId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ticketService: Ticket
  ) {
    this.route.paramMap.subscribe(params => {
      this.ticketId = params.get('id');
      this.loadTicket();
    });
  }

  loadTicket() {
    if (!this.ticketId) {
      this.error = 'Identifiant de ticket manquant.';
      this.isLoading = false;
      return;
    }
    this.isLoading = true;
    this.error = null;
    this.ticketService.getTicketById(this.ticketId).subscribe({
      next: (data) => {
        this.ticket = data;
        this.isLoading = false;
      },
      error: () => {
        this.error = "Une erreur s'est produite lors du chargement du ticket.";
        this.isLoading = false;
      }
    });
  }

  refresh() {
    this.loadTicket();
  }

  retry() {
    this.loadTicket();
  }

  deleteTicket() {
    if (!this.ticketId) return;
    this.isLoading = true;
    this.ticketService.deleteTicket(this.ticketId).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/dashboard-user']);
      },
      error: () => {
        this.error = 'Suppression impossible. Veuillez réessayer.';
        this.isLoading = false;
      }
    });
  }

  goBack() {
    this.router.navigate(['/dashboard-user']);
  }
}
