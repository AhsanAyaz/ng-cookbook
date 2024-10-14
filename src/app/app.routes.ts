import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('./home-wrapper/home-wrapper.component').then(
        (m) => m.HomeWrapperComponent
      ),
  },
  {
    path: 'thank-you',
    loadComponent: () =>
      import('./thank-you/thank-you.component').then(
        (m) => m.ThankYouComponent
      ),
  },
  {
    path: 's/:id',
    loadComponent: () =>
      import('./snippets/snippets.component').then((m) => m.SnippetsComponent),
  },
  {
    path: '**',
    loadComponent: () =>
      import('./not-found/not-found.component').then(
        (m) => m.NotFoundComponent
      ),
  },
];
