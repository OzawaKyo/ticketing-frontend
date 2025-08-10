import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { Auth } from '../services/auth';

export const redirectGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(Auth);
  
  // Check if user is authenticated
  if (authService.isAuthenticated()) {
    // User is authenticated, redirect to dashboard via UrlTree
    return router.createUrlTree(['dashboard']);
  } else {
    // User is not authenticated, redirect to homepage via UrlTree
    return router.createUrlTree(['homepage']);
  }
};
