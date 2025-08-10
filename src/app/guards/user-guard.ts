import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable, map, catchError, of } from 'rxjs';
import { User } from '../user';

@Injectable({
  providedIn: 'root'
})
export class UserGuard implements CanActivate {

  constructor(private userService: User, private router: Router) {}

  canActivate(): Observable<boolean | UrlTree> {
    return this.userService.getUserRole().pipe(
      map(role => {
        if (role === 'user') {
          return true;
        } else {
          return this.router.createUrlTree(['/dashboard-admin']);
        }
      }),
      catchError(() => of(this.router.createUrlTree(['/homepage'])))
    );
  }
}
