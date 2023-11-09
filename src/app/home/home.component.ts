import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MailchimpNg2eComponent } from '../components/mailchimp-ng2e/mailchimp-ng2e.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MailchimpNg2eComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {}
