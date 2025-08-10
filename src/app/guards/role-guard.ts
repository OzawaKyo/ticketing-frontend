import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable, map } from 'rxjs';
import { User } from '../user';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private userService: User, private router: Router) {}

  canActivate(): Observable<boolean | UrlTree> {
    return this.userService.getUserRole().pipe(
      map(role => {
        if (role === 'admin') {
          return this.router.createUrlTree(['/dashboard-admin']);
        }
        if (role === 'user') {
          return this.router.createUrlTree(['/dashboard-user']);
        }
        return this.router.createUrlTree(['/homepage']);
      })
    );
  }
}
