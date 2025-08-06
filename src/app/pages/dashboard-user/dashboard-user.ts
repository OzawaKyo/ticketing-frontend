import { Component, OnInit } from '@angular/core';
import { User } from '../../user';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Navbar } from '../navbar/navbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-dashboard-user',
  imports: [
    CommonModule, 
    MatSidenavModule, 
    MatButtonModule, 
    MatIconModule, 
    MatListModule,
    Navbar
  ],
  templateUrl: './dashboard-user.html',
  styleUrls: ['./dashboard-user.css']
})
export class DashboardUser implements OnInit {
  userRole: string = '';
  userProfile: any = null;
  isLoading: boolean = true;
  selectedTab: string = 'tab1';

  constructor(private userService: User, private router: Router) { }

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

  selectTab(tab: string): void {
    this.selectedTab = tab;
  }

  createNewTicket(): void {
  }
}   