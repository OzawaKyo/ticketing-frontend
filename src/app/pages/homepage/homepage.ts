import { Component } from '@angular/core';
import { Navbar } from '../navbar/navbar';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Login } from '../login/login';
import { Register } from '../register/register';

@Component({
  selector: 'app-homepage',
  imports: [ CommonModule, Navbar, MatButtonModule, Login, Register ],
  templateUrl: './homepage.html',
  styleUrl: './homepage.css'
})
export class Homepage { 

  showLogin = false;
  showRegister = false;

  constructor(private router: Router) { }

  onLoginClick() {
    this.showLogin = true;
    this.showRegister = false;
  }
  onRegisterClick() {
    this.showRegister = true;
    this.showLogin = false;
  }

}