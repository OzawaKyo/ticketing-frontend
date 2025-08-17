import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Ticket } from '../../services/ticket';

@Component({
  selector: 'app-view-ticket',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, MatProgressSpinnerModule, MatChipsModule, MatTooltipModule],
  templateUrl: './view-ticket.html',
  styleUrls: ['./view-ticket.css']
})
export class ViewTicketComponent implements OnChanges {
    @Input() ticketId!: number;
  @Output() backToList = new EventEmitter<void>();
  @Output() editTicket = new EventEmitter<number>();
  @Output() deleteTicket = new EventEmitter<number>();

  isLoading = false;
  error: string | null = null;
  ticket: any = null;

  constructor(private ticketService: Ticket) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['ticketId'] && this.ticketId) {
      this.loadTicket();
    }
  }

  loadTicket() {
    if (!this.ticketId) return;
    
    this.isLoading = true;
    this.error = null;
    this.ticketService.getTicketById(this.ticketId.toString()).subscribe({
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

  onDeleteTicket() {
    if (this.ticketId) {
      this.deleteTicket.emit(this.ticketId);
    }
  }

  onEditTicket() {
    if (this.ticketId) {
      this.editTicket.emit(this.ticketId);
    }
  }

  goBack() {
    this.backToList.emit();
  }

  getStatus(status: string): string {
    switch (status?.toLowerCase()) {
      case 'open':
        return 'Ouvert';
      case 'in_progress':
        return 'En cours';
      case 'closed':
        return 'Fermé';
      default:
        return 'Statut inconnu';
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
}
