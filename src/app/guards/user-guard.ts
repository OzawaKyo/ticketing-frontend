import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, map, catchError, of } from 'rxjs';
import { User } from '../user';

@Injectable({
  providedIn: 'root'
})
export class UserGuard implements CanActivate {

  constructor(private userService: User, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.userService.getUserRole().pipe(
      map(role => {
        console.log('User Guard - Rôle vérifié:', role);
        if (role === 'user') {
          return true;
        } else {
          console.log('Accès refusé - Rôle requis: user, Rôle actuel:', role);
          this.router.navigate(['/dashboard-admin']);
          return false;
        }
      }),
      catchError(error => {
        console.error('Erreur lors de la vérification du rôle user:', error);
        this.router.navigate(['/homepage']);
        return of(false);
      })
    );
  }
}
