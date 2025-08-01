import { Component } from '@angular/core';
import { Navbar } from '../navbar/navbar';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-homepage',
  imports: [ Navbar, MatButtonModule ],
  templateUrl: './homepage.html',
  styleUrl: './homepage.css'
})
export class Homepage {

  constructor(private router: Router) { }

  onLoginClick() {
    this.router.navigate(['/login']);
  }
  onRegisterClick() {
    this.router.navigate(['/register']);
  }

}