import { Routes } from '@angular/router';
import { ProblemDetail } from './problem-detail/problem-detail/problem-detail';
import { ProblemsList } from './problems-list/problems-list/problems-list';

export const PROBLEM_ROUTES: Routes = [
  {
    path: ':slug', // /problems/problem-detail -- this route will be used to display the details of a specific problem, including its description, input/output format, and sample test cases.
    loadComponent: ()=> import('./problem-detail/problem-detail/problem-detail').then(m => m.ProblemDetail)
  },
  {
    path: '',   // /problems 
   loadComponent: ()=> import('./problems-list/problems-list/problems-list').then(m => m.ProblemsList)
  }
];