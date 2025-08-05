import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, map, tap } from 'rxjs';
import { User } from '../user';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private userService: User, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.userService.getUserRole().pipe(
      tap(role => {
        console.log('Role Guard - Rôle détecté:', role);
        
        // Redirection basée sur le rôle
        if (role === 'admin') {
          this.router.navigate(['/dashboard-admin']);
        } else if (role === 'user') {
          this.router.navigate(['/dashboard-user']);
        } else {
          console.error('Rôle inconnu:', role);
          this.router.navigate(['/homepage']);
        }
      }),
      map(() => false) // On empêche l'accès à la route actuelle car on redirige
    );
  }
}
