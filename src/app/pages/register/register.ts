import { Component, Output, EventEmitter, OnInit, ChangeDetectorRef, AfterViewInit } from '@angular/core';
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
@Component({
  selector: 'app-register',
  imports: [  CommonModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule ],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register implements OnInit, AfterViewInit {
  @Output() loginClick = new EventEmitter<void>();

  hidePassword = true;
  hideConfirmPassword = true;

  registerForm: FormGroup;

  errorMessage: string | null = null;
  isLoading = false;

  constructor(private formBuilder: FormBuilder, private cdr: ChangeDetectorRef , private auth: Auth, private router: Router) {
    this.registerForm = this.formBuilder.group({
      prenom: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      nom: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {
    // Forcer la détection des changements au démarrage
    this.cdr.detectChanges();
  }

  ngAfterViewInit() {
    // Forcer la détection après que la vue soit initialisée
    setTimeout(() => {
      this.cdr.detectChanges();
    }, 0);
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      this.errorMessage = null; // Reset error message
      const { prenom, nom, email, password } = this.registerForm.value;
      this.auth.register(prenom, nom, email, password).subscribe(
        (response) => {
          this.isLoading = false;
          this.router.navigate(['/dashboard']);
        },
        (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Erreur lors de l\'inscription. Veuillez réessayer.';
        }
      );
    }
  }

  onLoginClick() {
    this.loginClick.emit();
  }

    togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }
  toggleConfirmPasswordVisibility() {
    this.hideConfirmPassword = !this.hideConfirmPassword;
  }
} 

