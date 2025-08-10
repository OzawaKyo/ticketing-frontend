import { Component, signal, OnDestroy } from '@angular/core';
import { Router, RouterOutlet, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Navbar } from './pages/navbar/navbar';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, Navbar],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnDestroy {
  protected readonly title = signal('ticketing-frontend');
  isNavigating = false;
  private routerSub?: Subscription;

  constructor(private router: Router) {
    this.routerSub = this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.isNavigating = true;
      }
      if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) {
        this.isNavigating = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.routerSub?.unsubscribe();
  }
}
