import { Routes } from '@angular/router';


export const LANDING_ROUTES: Routes = [
  {
    path: '', //matches the base path (just this  '/')
    loadComponent: () => import('./landing').then(m => m.LandingComponent)
  }
];