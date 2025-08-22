import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Ticket } from '../../services/ticket';
import { Comment } from '../../services/comment';
import { StatusChangeConfirmationDialog } from '../../shared/dialogs/status-change-confirmation-dialog.component';

@Component({
  selector: 'app-view-ticket',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    MatCardModule, 
    MatIconModule, 
    MatButtonModule, 
    MatProgressSpinnerModule, 
    MatChipsModule, 
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule
  ],
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

  // Propriétés pour les commentaires
  newComment: string = '';
  isAddingComment: boolean = false;
  showCommentForm: boolean = false;

  constructor(private ticketService: Ticket, private commentService: Comment, private dialog: MatDialog) {}

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

  getStatusColor(status: string): string {
    switch (status?.toLowerCase()) {
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

  toggleTicketStatus() {
    if (!this.ticket || !this.ticketId) return;

    const currentStatus = this.ticket.status.toLowerCase();
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
        ticketTitle: this.ticket.title,
        currentStatus: this.getStatus(this.ticket.status),
        newStatus: statusText
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.performStatusChange(newStatus);
      }
    });
  }

  private performStatusChange(newStatus: string) {
    if (!this.ticketId) return;

    // Appel à l'API pour mettre à jour le statut
    this.ticketService.updateTicketStatus(this.ticketId.toString(), newStatus).subscribe({
      next: () => {
        console.log('Statut du ticket mis à jour avec succès');
        // Mettre à jour le ticket localement
        this.ticket.status = newStatus;
      },
      error: (error) => {
        console.error('Erreur lors de la mise à jour du statut:', error);
        // Ici vous pourriez afficher un message d'erreur à l'utilisateur
      }
    });
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

  // Méthodes pour les commentaires
  toggleCommentForm() {
    this.showCommentForm = !this.showCommentForm;
    if (!this.showCommentForm) {
      this.newComment = '';
    }
  }

  addComment() {
    if (!this.newComment.trim() || this.isAddingComment) {
      return;
    }

    this.isAddingComment = true;
    this.commentService.createComment(this.ticketId.toString(), this.newComment.trim()).subscribe({
      next: (response) => {
        console.log('Commentaire ajouté:', response);
        // Recharger le ticket pour afficher le nouveau commentaire
        this.loadTicket();
        // Réinitialiser le formulaire
        this.newComment = '';
        this.showCommentForm = false;
        this.isAddingComment = false;
      },
      error: (error) => {
        console.error('Erreur lors de l\'ajout du commentaire:', error);
        this.isAddingComment = false;
        // Vous pouvez ajouter une notification d'erreur ici
      }
    });
  }

  cancelComment() {
    this.newComment = '';
    this.showCommentForm = false;
  }
}
