import {
  ApplicationConfig,
  isDevMode,
  importProvidersFrom,
  provideExperimentalZonelessChangeDetection,
} from '@angular/core';
import {
  provideRouter,
  withComponentInputBinding,
  withHashLocation,
} from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideMarkdown } from 'ngx-markdown';

import { routes } from './app.routes';
import { provideServiceWorker } from '@angular/service-worker';
import { FeatherModule } from 'angular-feather';
import {
  Camera,
  Heart,
  Github,
  X,
  User,
  Mail,
  Book,
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
  MessageCircle,
  FileText,
  Zap,
  Shield,
  Pocket,
  Send,
  ArrowRight,
  RefreshCcw,
  List,
  Play,
  Layers,
  GitBranch,
} from 'angular-feather/icons';
import { provideClientHydration } from '@angular/platform-browser';

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
  FileText,
  Zap,
  Shield,
  Pocket,
  Send,
  ArrowRight,
  RefreshCcw,
  List,
  Play,
  Layers,
  GitBranch,
  Github,
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
    provideMarkdown(),
    importProvidersFrom(FeatherModule.pick(icons)),
    provideHttpClient(withFetch()),
    provideExperimentalZonelessChangeDetection(),
  ],
};
