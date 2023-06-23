import { Routes } from '@angular/router';

export const routes: Routes = [{
  path: '',
  pathMatch: 'full',
  redirectTo: 'home'
}, {
  path: 'home',
  loadComponent: () => import('./home/home.component').then(m => m.HomeComponent)
}, {
  path: 's/:id',
  loadComponent: () => import('./snippets/snippets.component').then(m => m.SnippetsComponent)
}, {
  path: '**',
  redirectTo: 'home'
}];
