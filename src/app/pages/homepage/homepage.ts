import { Component } from '@angular/core';
import { Navbar } from '../navbar/navbar';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { Login } from '../login/login';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-homepage',
  imports: [ CommonModule, Navbar, MatButtonModule, Login ],
  templateUrl: './homepage.html',
  styleUrl: './homepage.css'
})
export class Homepage {

  showLogin = false;

  constructor(private router: Router) { }

  onLoginClick() {
    // this.router.navigate(['/login']);
    this.showLogin = true;
  }
  onRegisterClick() {
    this.router.navigate(['/register']);
  }

}