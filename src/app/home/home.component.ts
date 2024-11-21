import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MailchimpNg2eComponent } from '../components/mailchimp-ng2e/mailchimp-ng2e.component';
import { HeaderComponent } from '../components/header/header.component';
import { AnalyticsEvent } from '../constants/analyticsEvents';
@Component({
  selector: 'app-home',
  imports: [CommonModule, MailchimpNg2eComponent, HeaderComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  events = AnalyticsEvent;
}
