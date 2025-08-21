import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Users } from '../../services/users';

@Component({
  selector: 'app-users-management',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatTooltipModule
  ],
  templateUrl: './users-management.html',
  styleUrls: ['./users-management.css']
})
export class UsersManagementComponent implements OnInit {
  users: any[] = [];
  isLoading: boolean = false;
  error: string | null = null;
  
  displayedColumns: string[] = ['id', 'userInfo', 'role', 'createdAt', 'updatedAt', 'actions'];

  constructor(private usersService: Users, private dialog: MatDialog) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.isLoading = true;
    this.error = null;
    
    this.usersService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des utilisateurs:', error);
        this.error = 'Erreur lors du chargement des utilisateurs';
        this.isLoading = false;
      }
    });
  }

  deleteUser(user: any) {
    const dialogRef = this.dialog.open(DeleteConfirmationDialog, {
      width: '400px',
      data: { user: user }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.performDelete(user.id);
      }
    });
  }

  private performDelete(userId: string) {
    this.usersService.deleteUser(userId).subscribe({
      next: () => {
        console.log('Utilisateur supprimé avec succès');
        // Recharger la liste des utilisateurs
        this.loadUsers();
      },
      error: (error) => {
        console.error('Erreur lors de la suppression:', error);
        this.error = 'Erreur lors de la suppression de l\'utilisateur';
      }
    });
  }

  getRoleBadgeClass(role: string): string {
    switch (role?.toLowerCase()) {
      case 'admin':
        return 'role-admin';
      case 'user':
        return 'role-user';
      default:
        return 'role-default';
    }
  }

  formatDate(dateString: string): string {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }) + ' à ' + date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}

// Composant de dialogue de confirmation
@Component({
  selector: 'delete-confirmation-dialog',
  template: `
    <div class="dialog-container">
      <h2 mat-dialog-title class="dialog-title">
        <mat-icon>warning</mat-icon>
        Confirmer la suppression
      </h2>
      <mat-dialog-content class="dialog-content">
        <p>Êtes-vous sûr de vouloir supprimer cet utilisateur ?</p>
        <div class="user-info">
          <p><strong>Nom :</strong> {{ data.user.prenom }} {{ data.user.nom }}</p>
          <p><strong>Email :</strong> {{ data.user.email }}</p>
          <p><strong>Rôle :</strong> {{ data.user.role }}</p>
        </div>
        <p class="warning-text">Cette action est irréversible.</p>
      </mat-dialog-content>
      <mat-dialog-actions align="end" class="dialog-actions">
        <button mat-button (click)="onCancel()" class="cancel-btn">
          <mat-icon>cancel</mat-icon>
          Annuler
        </button>
        <button mat-raised-button (click)="onConfirm()" class="delete-btn">
          <mat-icon>delete_forever</mat-icon>
          Supprimer
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .dialog-container {
      background-color: #1D1B20;
      color: #CCC2DC;
    }
    
    .dialog-title {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #CCC2DC;
      border-bottom: 1px solid rgba(204, 194, 220, 0.2);
      padding-bottom: 12px;
      margin-bottom: 16px;
    }
    
    .dialog-title mat-icon {
      color: #f44336;
    }
    
    .dialog-content {
      color: #CCC2DC;
    }
    
    .user-info {
      background: rgba(204, 194, 220, 0.05);
      padding: 12px;
      border-radius: 8px;
      margin: 12px 0;
      border: 1px solid rgba(204, 194, 220, 0.1);
    }
    
    .warning-text {
      color: #f44336;
      font-weight: 500;
      margin-top: 12px;
    }
    
    .dialog-actions {
      padding-top: 16px;
      border-top: 1px solid rgba(204, 194, 220, 0.2);
    }
    
    .cancel-btn {
      color: #B4A7C6 !important;
      border: 1px solid rgba(180, 167, 198, 0.3) !important;
      border-radius: 8px !important;
      font-weight: 500 !important;
      text-transform: none !important;
    }
    
    .cancel-btn:hover {
      background-color: rgba(180, 167, 198, 0.1) !important;
    }
    
    .delete-btn {
      background-color: rgba(244, 67, 54, 0.15) !important;
      color: #f44336 !important;
      border: 1px solid rgba(244, 67, 54, 0.3) !important;
      border-radius: 8px !important;
      font-weight: 500 !important;
      text-transform: none !important;
    }
    
    .delete-btn:hover {
      background-color: rgba(244, 67, 54, 0.25) !important;
    }
  `],
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  standalone: true
})
export class DeleteConfirmationDialog {
  constructor(
    public dialogRef: MatDialogRef<DeleteConfirmationDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { user: any }
  ) {}

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}
