import { Component, OnInit } from '@angular/core';
import { User } from '../../user';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { Auth } from '../../serices/auth';


@Component({
  selector: 'app-dashboard-user',
  imports: [CommonModule, MatCardModule],
  templateUrl: './dashboard-user.html',
  styleUrls: ['./dashboard-user.css']
})
export class DashboardUser implements OnInit {
  userRole: string = '';
  userProfile: any = null;
  isLoading: boolean = true;

  constructor(private userService: User, private authService: Auth, private router: Router) { }

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

  logOut(): void {
    this.authService.logout();
  }
}