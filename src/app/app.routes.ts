import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';
import { redirectGuard } from './guards/redirect-guard';
import { publicGuard } from './guards/public-guard';
import { RoleGuard } from './guards/role-guard';
import { AdminGuard } from './guards/admin-guard';
import { UserGuard } from './guards/user-guard';

export const routes: Routes = [
  { path: '', canActivate: [redirectGuard], children: [] },
  { path: 'dashboard', canActivate: [authGuard, RoleGuard], children: [] },
  {
    path: 'dashboard-user',
    canActivate: [authGuard, UserGuard],
    loadComponent: () => import('./pages/dashboard-user/dashboard-user').then(m => m.DashboardUser)
  },
  {
    path: 'dashboard-admin',
    canActivate: [authGuard, AdminGuard],
    loadComponent: () => import('./pages/dashboard-admin/dashboard-admin').then(m => m.DashboardAdmin)
  },
  {
    path: 'homepage',
    canActivate: [publicGuard],
    loadComponent: () => import('./pages/homepage/homepage').then(m => m.Homepage)
  },
  {
    path: 'tickets/create',
    canActivate: [authGuard, UserGuard],
    loadComponent: () => import('./pages/new-ticket/new-ticket').then(m => m.NewTicket)
  },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];
export default routes;