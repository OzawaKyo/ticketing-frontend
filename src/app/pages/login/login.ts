import { Component, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { Auth } from '../../serices/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  @Output() registerClick = new EventEmitter<void>();

  loginForm: FormGroup;
  hidePassword = true;
  isLoading = false;
  errorMessage: string | null = null;

  constructor(private formBuilder: FormBuilder, private auth: Auth, private router: Router) {

    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = null; // Reset error message
      const { email, password } = this.loginForm.value;
      this.auth.login(email, password).subscribe(
        response => {
          this.isLoading = false;
          this.router.navigate(['/dashboard']);
        },
        error => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Erreur de connexion. Veuillez vérifier vos identifiants.';
        }
      );
    }
  }

  onRegisterClick() {
    this.registerClick.emit();
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }
}
