import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      // import('./home/home.component').then((m) => m.HomeComponent),
      import('./landing/landing.component').then((m) => m.LandingComponent),
  },
  {
    path: 'landing',
    loadComponent: () =>
      import('./landing-personal/landing-personal.component').then(
        (m) => m.LandingPersonalComponent
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
