import { Component, OnInit } from '@angular/core';
import { User } from '../../user';
import { Auth } from '../../services/auth';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { TicketTableComponent } from '../../components/ticket-table/ticket-table';
import { ViewTicketComponent } from '../../components/view-ticket/view-ticket';
import { UsersManagementComponent } from '../../components/users-management/users-management';

@Component({
  selector: 'app-dashboard-admin',
  imports: [
    CommonModule, 
    MatSidenavModule, 
    MatButtonModule, 
    MatIconModule, 
    MatListModule,
    TicketTableComponent,
    ViewTicketComponent,
    UsersManagementComponent
  ],
  templateUrl: './dashboard-admin.html',
  styleUrl: './dashboard-admin.css'
})
export class DashboardAdmin implements OnInit {
  userRole: string = '';
  userProfile: any = null;
  isLoading: boolean = true;
  selectedTab: string = 'tab1';
  
  // Propriétés pour la gestion de la vue ticket
  selectedTicketId: number | null = null;
  isViewingTicket: boolean = false;

  constructor(private userService: User, private authService: Auth, private router: Router) { }

  ngOnInit(): void {
    // Vérifier si l'utilisateur est authentifié avant de charger les données
    if (!this.authService.isAuthenticated()) {
      console.log('Utilisateur non authentifié, redirection vers la page de connexion');
      this.router.navigate(['/login']);
      return;
    }
    this.loadUserData();
  }

  loadUserData(): void {
    this.userService.getUserProfile().subscribe({
      next: (profile) => {
        this.userProfile = profile;
        this.userRole = profile.role;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement du profil:', error);
        this.isLoading = false;
        
        // Si c'est une erreur 401, l'interceptor s'en chargera automatiquement
        // Mais on peut ajouter une gestion locale supplémentaire si nécessaire
        if (error.status === 401) {
          console.log('Token invalide détecté dans le dashboard');
          this.authService.logout();
          this.router.navigate(['/login']);
        }
      }
    });
  }

  selectTab(tab: string): void {
    this.selectedTab = tab;
  }

  createNewTicket(): void {
    this.router.navigate(['/tickets/create']);
  }

  // Méthodes pour gérer la vue ticket
  viewTicket(ticketId: number): void {
    this.selectedTicketId = ticketId;
    this.isViewingTicket = true;
  }

  backToTicketList(): void {
    this.isViewingTicket = false;
    this.selectedTicketId = null;
  }

  editTicket(ticketId: number): void {
    this.router.navigate(['/tickets', ticketId, 'edit']);
  }

  deleteTicket(ticketId: number): void {
    // La logique de suppression sera gérée par le composant view-ticket
    console.log('Suppression du ticket:', ticketId);
    this.backToTicketList();
  }
}
