import { Component, inject } from '@angular/core';
import { BehaviorsDirective } from '../directives/behaviors.directive';
import { FeatherModule } from 'angular-feather';
import { BookHeightDirective } from '../directives/book-height.directive';
import { ChatComponent } from '../components/chat.component';
import { logEvent, getAnalytics, Analytics } from '@angular/fire/analytics';
import { AnalyticsEvent } from '../constants/analyticsEvents';
@Component({
  selector: 'app-landing-personal',
  standalone: true,
  imports: [
    BehaviorsDirective,
    FeatherModule,
    BookHeightDirective,
    ChatComponent,
  ],
  templateUrl: './landing-personal.component.html',
  styleUrl: './landing-personal.component.scss',
})
export class LandingPersonalComponent {
  events = AnalyticsEvent;
  analytics = inject(Analytics);
  sendAnalyticsEvent(event: AnalyticsEvent) {
    logEvent(this.analytics, event);
  }
}
