import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { Ticket } from '../../services/ticket';

@Component({
  selector: 'app-view-ticket',
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, MatProgressSpinnerModule, MatChipsModule, MatTooltipModule],
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

  getStatusIcon(status: string): string {
    switch (status?.toLowerCase()) {
      case 'ouvert':
      case 'open':
        return 'radio_button_unchecked';
      case 'en cours':
      case 'in progress':
        return 'pending';
      case 'fermé':
      case 'closed':
        return 'check_circle';
      case 'résolu':
      case 'resolved':
        return 'task_alt';
      default:
        return 'help_outline';
    }
  }

  getPriorityIcon(priority: string): string {
    switch (priority?.toLowerCase()) {
      case 'basse':
      case 'low':
        return 'keyboard_arrow_down';
      case 'moyenne':
      case 'medium':
        return 'remove';
      case 'haute':
      case 'high':
        return 'keyboard_arrow_up';
      case 'critique':
      case 'critical':
        return 'priority_high';
      default:
        return 'help_outline';
    }
  }

  getFileIcon(type: string): string {
    const fileType = type?.toLowerCase();
    if (fileType?.includes('image')) return 'image';
    if (fileType?.includes('pdf')) return 'picture_as_pdf';
    if (fileType?.includes('word') || fileType?.includes('document')) return 'description';
    if (fileType?.includes('excel') || fileType?.includes('spreadsheet')) return 'table_chart';
    if (fileType?.includes('text')) return 'text_snippet';
    if (fileType?.includes('zip') || fileType?.includes('rar')) return 'folder_zip';
    return 'attach_file';
  }

  formatFileSize(bytes: number): string {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  downloadAttachment(attachment: any) {
    // Simuler le téléchargement - à implémenter selon votre API
    console.log('Téléchargement de:', attachment.name);
    // Vous pouvez implémenter la logique de téléchargement ici
  }

  editTicket() {
    if (this.ticketId) {
      this.router.navigate(['/edit-ticket', this.ticketId]);
    }
  }
}
