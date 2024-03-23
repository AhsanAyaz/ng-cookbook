import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MailchimpNg2eComponent } from '../components/mailchimp-ng2e/mailchimp-ng2e.component';
import { getAnalytics, logEvent } from '@angular/fire/analytics';
import { HeaderComponent } from '../components/header/header.component';

enum AnalyticsEvent {
  NGCB1_CLICK = 'ng-cookbook-1 link clicked',
  NGCB2_CLICK = 'ng-cookbook-2 link clicked',
  NGCB2_GH_CLICK = 'ng-cookbook-2 github link clicked',
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MailchimpNg2eComponent, HeaderComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  events = AnalyticsEvent;
  sendAnalyticsEvent(event: AnalyticsEvent) {
    logEvent(getAnalytics(), event);
  }
}
