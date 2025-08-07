import { Routes } from '@angular/router';
import { Homepage } from './pages/homepage/homepage';
import { DashboardUser } from './pages/dashboard-user/dashboard-user';
import { DashboardAdmin } from './pages/dashboard-admin/dashboard-admin';
import { authGuard } from './guards/auth-guard';
import { redirectGuard } from './guards/redirect-guard';
import { publicGuard } from './guards/public-guard';
import { RoleGuard } from './guards/role-guard';
import { AdminGuard } from './guards/admin-guard';
import { UserGuard } from './guards/user-guard';
import { NewTicket } from './pages/new-ticket/new-ticket';

export const routes: Routes = [
    { path: '', canActivate: [redirectGuard], children: [] }, // Smart redirect based on auth status
    { path: 'dashboard', canActivate: [authGuard, RoleGuard], children: [] }, // Redirige vers le bon dashboard selon le rôle
    { path: 'dashboard-user', component: DashboardUser, canActivate: [authGuard, UserGuard] },
    { path: 'dashboard-admin', component: DashboardAdmin, canActivate: [authGuard, AdminGuard] },
    { path: 'homepage', component: Homepage, canActivate: [publicGuard] }, // Redirect to dashboard if already logged in
    { path: 'tickets/create', component: NewTicket , canActivate: [authGuard, UserGuard] },// Route for creating a new ticket
    { path: '**', redirectTo: '', pathMatch: 'full' } // Wildcard route - redirect to root for smart routing
];
export default routes;