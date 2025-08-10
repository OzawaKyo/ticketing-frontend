import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Auth } from '../services/auth';

export const publicGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(Auth);
  
  if (authService.isAuthenticated()) {
    // Redirect to dashboard via UrlTree
    return router.createUrlTree(['dashboard']);
  } else {
    // Allow access to public page
    return true;
  }
};
