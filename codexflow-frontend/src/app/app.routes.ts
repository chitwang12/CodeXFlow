import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('./features/landing/landing/landing').then(m => m.LandingComponent)
    },
    {
        path: 'auth',
        canActivate: [authGuard],
        loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
    },
    {
        path: 'problems',
        canActivate: [authGuard],
        loadChildren: () => import('./features/problems/problem.routes').then(m => m.PROBLEM_ROUTES)
    },
    {
        path: 'profile',
        canActivate: [authGuard],
        loadChildren: () => import('./features/profiles/profile/profile.routes').then(m => m.LANDING_ROUTES)
    },
    {
        path: '**',
        redirectTo: ''
    }
];
