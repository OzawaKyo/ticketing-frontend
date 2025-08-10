import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { Auth } from '../../services/auth';
import { Router } from '@angular/router';
import { Ticket } from '../../services/ticket';

@Component({
  selector: 'app-new-ticket',
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './new-ticket.html',
  styleUrls: ['./new-ticket.css']
})
export class NewTicket {
  ticketForm: FormGroup;
  isLoading = false;
  error: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private ticketService: Ticket,
    private authService: Auth,
    private router: Router
  ) {
    this.ticketForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]]
    });
  }

  onSubmit() {
    if (this.ticketForm.valid && !this.isLoading) {
      this.isLoading = true;
      this.error = null;

      const { title, description } = this.ticketForm.value;

      this.ticketService.createTicket(title, description).subscribe({
        next: (response) => {
          // console.log('Ticket créé avec succès:', response);
          this.isLoading = false;
          // Redirection vers le dashboard après création
          this.router.navigate(['/dashboard-user']);
        },
        error: (error) => {
          // console.error('Erreur lors de la création du ticket:', error);
          this.error = 'Erreur lors de la création du ticket. Veuillez réessayer.';
          this.isLoading = false;
        }
      });
    } else {
      // Marquer tous les champs comme touchés pour afficher les erreurs
      this.ticketForm.markAllAsTouched();
    }
  }

  goBack() {
    this.router.navigate(['/dashboard-user']);
  }
}
