import { Routes } from '@angular/router';
import { Homepage } from './pages/homepage/homepage';
import { Dashboard } from './pages/dashboard/dashboard';
import { authGuard } from './guards/auth-guard';
import { redirectGuard } from './guards/redirect-guard';
import { publicGuard } from './guards/public-guard';

export const routes: Routes = [
    { path: '', canActivate: [redirectGuard], children: [] }, // Smart redirect based on auth status
    { path: 'dashboard', component: Dashboard, canActivate: [authGuard] },
    { path: 'homepage', component: Homepage, canActivate: [publicGuard] }, // Redirect to dashboard if already logged in
    { path: '**', redirectTo: '', pathMatch: 'full' } // Wildcard route - redirect to root for smart routing
];
export default routes;