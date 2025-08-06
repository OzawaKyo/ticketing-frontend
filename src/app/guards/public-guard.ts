import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Auth } from '../services/auth';

export const publicGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(Auth);
  
  // Check if user is authenticated
  if (authService.isAuthenticated()) {
    // User is authenticated, redirect to dashboard
    router.navigate(['dashboard']);
    return false;
  } else {
    // User is not authenticated, allow access to public page
    return true;
  }
};
