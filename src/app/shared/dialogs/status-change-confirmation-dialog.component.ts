import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'status-change-confirmation-dialog',
  template: `
    <h2 mat-dialog-title>Confirmer le changement de statut</h2>
    <div mat-dialog-content>
      <p>Voulez-vous vraiment changer le statut du ticket <strong>"{{data.ticketTitle}}"</strong> ?</p>
      <div class="status-change-info">
        <div class="status-from">
          <span class="label">Statut actuel :</span>
          <mat-chip [color]="getChipColorForStatus(data.currentStatus)" selected>
            {{data.currentStatus}}
          </mat-chip>
        </div>
        <mat-icon class="arrow-icon">arrow_forward</mat-icon>
        <div class="status-to">
          <span class="label">Nouveau statut :</span>
          <mat-chip [color]="getChipColorForStatus(data.newStatus)" selected>
            {{data.newStatus}}
          </mat-chip>
        </div>
      </div>
    </div>
    <div mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Annuler</button>
      <button mat-raised-button color="primary" (click)="onConfirm()" cdkFocusInitial>
        Confirmer
      </button>
    </div>
  `,
  styles: [`
    .status-change-info {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 16px 0;
      padding: 16px;
      background-color: #2D2830;
      border-radius: 8px;
      border: 1px solid rgba(204, 194, 220, 0.2);
    }
    .status-from, .status-to {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
    }
    .label {
      font-size: 12px;
      color: #CCC2DC;
      font-weight: 500;
    }
    .arrow-icon {
      color: #CCC2DC;
      font-size: 24px;
    }
    mat-chip {
      font-weight: 500;
    }
    p {
      color: #CCC2DC;
      margin: 0 0 16px 0;
    }
    strong {
      color: #FFFFFF;
    }
  `],
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatIconModule, MatChipsModule, CommonModule]
})
export class StatusChangeConfirmationDialog {
  constructor(
    public dialogRef: MatDialogRef<StatusChangeConfirmationDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  getChipColorForStatus(status: string): string {
    switch (status.toLowerCase()) {
      case 'ouvert':
        return 'primary';
      case 'en cours':
        return 'accent';
      case 'fermé':
        return 'warn';
      default:
        return '';
    }
  }
}
