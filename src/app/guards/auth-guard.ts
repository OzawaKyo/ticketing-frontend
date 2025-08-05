import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Auth } from '../serices/auth';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(Auth);
  
  // Check if user is authenticated using the auth service
  if (authService.isAuthenticated()) {
    // User is authenticated
    return true;
    } else {
    // User is not authenticated, redirect to login
    router.navigate(['homepage']);
    return false;
  }
};
