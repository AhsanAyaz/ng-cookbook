import {
  ApplicationConfig,
  isDevMode,
  importProvidersFrom,
} from '@angular/core';
import {
  provideRouter,
  withComponentInputBinding,
  withHashLocation,
} from '@angular/router';
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
import { FeatherModule } from 'angular-feather';
import {
  Camera,
  Heart,
  Github,
  X,
  User,
  Mail,
  Book,
  MessageCircle,
  PieChart,
  Briefcase,
  Target,
  Monitor,
  Eye,
  Layout,
  Feather,
  Code,
  UserCheck,
  Globe,
  Settings,
  Facebook,
  Instagram,
  Linkedin,
  ArrowUp,
  ShoppingCart,
} from 'angular-feather/icons';

const icons = {
  ArrowUp,
  X,
  User,
  Mail,
  Book,
  MessageCircle,
  PieChart,
  Briefcase,
  Target,
  Monitor,
  Heart,
  Eye,
  Layout,
  Feather,
  Code,
  UserCheck,
  Globe,
  Settings,
  Facebook,
  Instagram,
  Linkedin,
  ShoppingCart,
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding(), withHashLocation()),
    provideHttpClient(withFetch()),
    provideClientHydration(),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
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
    ),
    provideAnalytics(() => getAnalytics()),
    ScreenTrackingService,
    importProvidersFrom(FeatherModule.pick(icons)),
  ],
};
