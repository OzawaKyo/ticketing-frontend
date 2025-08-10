import { Component, OnInit } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Auth } from '../../services/auth';
import { User } from '../../user';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule,
    RouterModule,
    CommonModule
  ],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css'] 
})
export class Navbar implements OnInit {
  isLoggedIn: boolean = false;
  userProfile: any = null;
  prenom: string = '';
  nom: string = '';
  role: string = '';
  isAdmin: boolean = false;

  constructor(
    private router: Router,
    private authService: Auth,
    private userService: User
  ) { }

  ngOnInit(): void {
    this.checkAuthStatus();
    // Re-vérifie l'état d'auth à chaque navigation (utile après login/logout)
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => this.checkAuthStatus());
  }

  checkAuthStatus(): void {
    this.isLoggedIn = this.authService.isAuthenticated();
    if (this.isLoggedIn) {
      this.loadUserProfile();
    }
  }

  loadUserProfile(): void {
    this.userService.getUserProfile().subscribe({
      next: (profile) => {
        this.userProfile = profile;
        this.prenom = profile.prenom || 'Utilisateur';
        this.nom = profile.nom || 'Utilisateur';
        if(profile.role === 'user') {
          this.role = 'Utilisateur';
          this.isAdmin = false;
        }
        else if(profile.role === 'admin') {
          this.role = 'Administrateur';
          this.isAdmin = true;
        }
      },
      error: (error) => {
        console.error('Erreur lors du chargement du profil:', error);
        // Ne pas masquer le menu profil si le token est présent
        // L'interceptor gérera les tokens invalides et redirections si nécessaires
      }
    });
  }

  onLoginClick() {
    this.router.navigate(['/login']);
  }

  onMenuClick() {
    this.router.navigate(['']);
    // reload the page after navigating to home    
  }

  onProfileClick() {
    // Vous pouvez ajouter une navigation vers une page de profil si nécessaire
    console.log('Profil cliqué');
  }

  onLogoutClick() {
    this.authService.logout();
    this.isLoggedIn = false;
    this.userProfile = null;
    this.prenom = '';
    this.nom = '';
  }
  
}
