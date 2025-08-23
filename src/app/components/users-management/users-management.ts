import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { Users } from '../../services/users';
import { User } from '../../user';

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
    MatTooltipModule,
    MatSelectModule,
    MatFormFieldModule,
    MatChipsModule
  ],
  templateUrl: './users-management.html',
  styleUrls: ['./users-management.css']
})
export class UsersManagementComponent implements OnInit {
  users: any[] = [];
  isLoading: boolean = false;
  error: string | null = null;
  currentUserProfile: any = null;
  
  displayedColumns: string[] = ['id', 'userInfo', 'role', 'createdAt', 'updatedAt', 'actions'];

  constructor(private usersService: Users, private dialog: MatDialog, private userService: User) {}

  ngOnInit() {
    this.loadCurrentUserProfile();
    this.loadUsers();
  }

  loadCurrentUserProfile() {
    this.userService.getUserProfile().subscribe({
      next: (profile) => {
        this.currentUserProfile = profile;
      },
      error: (error) => {
        console.error('Erreur lors du chargement du profil utilisateur:', error);
      }
    });
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

  getRoleColor(role: string): string {
    switch (role?.toLowerCase()) {
      case 'admin':
        return 'warn';
      case 'user':
        return 'primary';
      default:
        return '';
    }
  }

  getRoleText(role: string): string {
    switch (role?.toLowerCase()) {
      case 'admin':
        return 'Administrateur';
      case 'user':
        return 'Utilisateur';
      default:
        return role;
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

  toggleUserRole(user: any): void {
    // Empêcher un utilisateur de changer son propre rôle
    if (this.isCurrentUser(user)) return;
    
    const newRole = user.role === 'user' ? 'admin' : 'user';
    
    // Ouvrir le dialogue de confirmation
    const dialogRef = this.dialog.open(RoleChangeConfirmationDialog, {
      width: '400px',
      data: { user: user, newRole: newRole }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.performRoleChange(user, newRole);
      }
    });
  }

  isCurrentUser(user: any): boolean {
    // Vérifier si l'utilisateur est celui actuellement connecté
    return this.currentUserProfile && this.currentUserProfile.id === user.id;
  }

  private performRoleChange(user: any, newRole: string) {
    // Appel à l'API pour mettre à jour le rôle
    this.usersService.updateUserRole(user.id, newRole).subscribe({
      next: () => {
        console.log('Rôle utilisateur mis à jour avec succès');
        // Mettre à jour localement
        user.role = newRole;
        user.updatedAt = new Date().toISOString();
      },
      error: (error: any) => {
        console.error('Erreur lors de la mise à jour du rôle:', error);
        this.error = 'Erreur lors de la mise à jour du rôle utilisateur';
      }
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

// Composant de dialogue de confirmation pour changement de rôle
@Component({
  selector: 'role-change-confirmation-dialog',
  template: `
    <h2 mat-dialog-title>Confirmer le changement de rôle</h2>
    <mat-dialog-content>
      <div class="user-info">
        <strong>{{data.user.prenom}} {{data.user.nom}}</strong><br>
        <em>{{data.user.email}}</em>
      </div>
      <p>Voulez-vous vraiment changer le rôle de <strong>{{data.user.role}}</strong> vers <strong>{{data.newRole}}</strong> ?</p>
      <div class="warning-text" *ngIf="data.newRole === 'admin'">
        ⚠️ Ce changement donnera des privilèges administrateur à cet utilisateur.
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end" class="dialog-actions">
      <button mat-button (click)="onCancel()" class="cancel-btn">Annuler</button>
      <button mat-button (click)="onConfirm()" 
              [ngClass]="data.newRole === 'admin' ? 'admin-btn' : 'user-btn'">
        Confirmer
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
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
      padding: 8px;
      background: rgba(244, 67, 54, 0.1);
      border-radius: 6px;
      border-left: 3px solid #f44336;
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
    
    .admin-btn {
      background-color: rgba(244, 67, 54, 0.15) !important;
      color: #f44336 !important;
      border: 1px solid rgba(244, 67, 54, 0.3) !important;
      border-radius: 8px !important;
      font-weight: 500 !important;
      text-transform: none !important;
    }
    
    .admin-btn:hover {
      background-color: rgba(244, 67, 54, 0.25) !important;
    }
    
    .user-btn {
      background-color: rgba(204, 194, 220, 0.15) !important;
      color: #CCC2DC !important;
      border: 1px solid rgba(204, 194, 220, 0.3) !important;
      border-radius: 8px !important;
      font-weight: 500 !important;
      text-transform: none !important;
    }
    
    .user-btn:hover {
      background-color: rgba(204, 194, 220, 0.25) !important;
    }
  `],
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  standalone: true
})
export class RoleChangeConfirmationDialog {
  constructor(
    public dialogRef: MatDialogRef<RoleChangeConfirmationDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { user: any, newRole: string }
  ) {}

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}
