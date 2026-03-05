import { Routes } from '@angular/router';
import { Login } from './login/login/login';
import { Signup } from './signup/signup/signup';

export const AUTH_ROUTES: Routes = [
  {
    path: 'login',
    component: Login
  },
  {
    path: 'signup',
    component: Signup
  }
];