import { Routes } from '@angular/router';
import { Login } from './login/login/login';
import { Signup } from './signup/signup/signup';

export const AUTH_ROUTES: Routes = [
  {
    path: 'login',
   loadComponent: () => import('./login/login/login').then(m => m.Login)
  },
  {
    path: 'signup',
    loadComponent: () => import('./signup/signup/signup').then(m => m.Signup)
  }
];