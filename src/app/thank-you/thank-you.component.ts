import { Component, computed, inject, input } from '@angular/core';
import { HeaderComponent } from '../components/header/header.component';
import { DomSanitizer } from '@angular/platform-browser';
import { PULSE_CHECKER_SESSIONS } from '../assets/pulsechecker-sessions';

@Component({
  selector: 'app-thank-you',
  standalone: true,
  imports: [HeaderComponent],
  templateUrl: './thank-you.component.html',
  styleUrl: './thank-you.component.scss',
})
export class ThankYouComponent {
  recipeName = input<string>();
  sanitizer = inject(DomSanitizer);
  session = computed(() => {
    const session = PULSE_CHECKER_SESSIONS[this.recipeName() || ''];
    if (!session) {
      return null;
    }
    return session;
  });
  reviewLink = computed(() => {
    if (!this.session()) {
      return '';
    }
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://pulsechecker.netlify.app/review-widget?sessionPin=${
        this.session()!.pin
      }`
    );
  });
}
