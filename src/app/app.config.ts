import {
  ApplicationConfig,
  isDevMode,
  importProvidersFrom,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideServiceWorker } from '@angular/service-worker';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import {
  getAnalytics,
  provideAnalytics,
  ScreenTrackingService,
} from '@angular/fire/analytics';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withFetch()),
    provideClientHydration(),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
    importProvidersFrom(
      provideFirebaseApp(() =>
        initializeApp({
          projectId: 'ng-cookbook-4d102',
          appId: '1:1038411915746:web:202192e0e2a689e86419bb',
          storageBucket: 'ng-cookbook-4d102.appspot.com',
          apiKey: 'AIzaSyDkwAMJ4ZBGY0AWQsvWy1p8wtCmLjfeu4I',
          authDomain: 'ng-cookbook-4d102.firebaseapp.com',
          messagingSenderId: '1038411915746',
          measurementId: 'G-Z1P15PWEJQ',
        })
      )
    ),
    importProvidersFrom(provideAnalytics(() => getAnalytics())),
    ScreenTrackingService,
  ],
};
