import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, map, catchError, of } from 'rxjs';
import { User } from '../user';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private userService: User, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.userService.getUserRole().pipe(
      map(role => {
        console.log('Admin Guard - Rôle vérifié:', role);
        if (role === 'admin') {
          return true;
        } else {
          console.log('Accès refusé - Rôle requis: admin, Rôle actuel:', role);
          this.router.navigate(['/dashboard-user']);
          return false;
        }
      }),
      catchError(error => {
        console.error('Erreur lors de la vérification du rôle admin:', error);
        this.router.navigate(['/homepage']);
        return of(false);
      })
    );
  }
}
