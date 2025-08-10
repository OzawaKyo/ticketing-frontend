import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Auth } from '../services/auth';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(Auth);
  
  // Check if user is authenticated using the auth service
  if (authService.isAuthenticated()) {
    return true;
  } else {
    // Return a UrlTree to redirect instead of imperative navigation
    return router.createUrlTree(['homepage']);
  }
};
