import { Component, OnInit } from '@angular/core';
import { User } from '../../user';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-admin',
  imports: [CommonModule],
  templateUrl: './dashboard-admin.html',
  styleUrl: './dashboard-admin.css'
})
export class DashboardAdmin implements OnInit {
  userRole: string = '';
  userProfile: any = null;
  isLoading: boolean = true;

  constructor(private userService: User) { }

  ngOnInit(): void {
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
      }
    });
  }
}
