import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    RouterModule],  
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css'] 
})
export class Navbar {

  constructor(private router: Router) { }


  onLoginClick() {
    this.router.navigate(['/login']);
  }

  onMenuClick() {
    this.router.navigate(['']);
    // reload the page to reset the state
    window.location.reload();
  }
}
