import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MailchimpNg2eComponent } from '../components/mailchimp-ng2e/mailchimp-ng2e.component';
import { Analytics, getAnalytics, logEvent } from '@angular/fire/analytics';
import { HeaderComponent } from '../components/header/header.component';
import { AnalyticsEvent } from '../constants/analyticsEvents';
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MailchimpNg2eComponent, HeaderComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  events = AnalyticsEvent;
  analytics = inject(Analytics);
  sendAnalyticsEvent(event: AnalyticsEvent) {
    logEvent(this.analytics, event);
  }
}
