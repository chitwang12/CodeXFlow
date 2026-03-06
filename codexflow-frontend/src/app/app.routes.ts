import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  {
    // loadComponent → resolves to a Component class
    path: '',
    loadComponent: () =>
      import('./features/landing/landing/landing')
        .then(m => m.LandingComponent),
  },
  {
    // No authGuard — logged-out users must reach login/signup
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth.routes')
        .then(m => m.AUTH_ROUTES),
  },
  {
    // loadChildren → resolves to a Routes array
    path: 'problems',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./features/problems/problem.routes')
        .then(m => m.PROBLEM_ROUTES),
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./features/profiles/profile/profile.routes')
        .then(m => m.LANDING_ROUTES),
  },
  { path: '**', redirectTo: '' },
];