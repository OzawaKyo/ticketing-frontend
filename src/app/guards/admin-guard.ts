import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable, map, catchError, of } from 'rxjs';
import { User } from '../user';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(private userService: User, private router: Router) {}

  canActivate(): Observable<boolean | UrlTree> {
    return this.userService.getUserRole().pipe(
      map(role => {
        console.log('Admin Guard - Rôle vérifié:', role);
        if (role === 'admin') {
          return true;
        } else {
          console.log('Accès refusé - Rôle requis: admin, Rôle actuel:', role);
          return this.router.createUrlTree(['/dashboard-user']);
        }
      }),
      catchError(() => of(this.router.createUrlTree(['/homepage'])))
    );
  }
}
