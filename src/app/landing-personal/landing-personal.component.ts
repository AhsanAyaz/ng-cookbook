import { Component, inject } from '@angular/core';
import { BehaviorsDirective } from '../directives/behaviors.directive';
import { FeatherModule } from 'angular-feather';
import { BookHeightDirective } from '../directives/book-height.directive';
import { ChatComponent } from '../components/chat.component';
import { logEvent, getAnalytics, Analytics } from '@angular/fire/analytics';
import { AnalyticsEvent } from '../constants/analyticsEvents';
import { MixpanelEvent } from '../services/mixpanel.service';
import { MixpanelService } from '../services/mixpanel.service';
@Component({
    selector: 'app-landing-personal',
    imports: [
        BehaviorsDirective,
        FeatherModule,
        BookHeightDirective,
        ChatComponent,
    ],
    templateUrl: './landing-personal.component.html',
    styleUrl: './landing-personal.component.scss'
})
export class LandingPersonalComponent {
  events = AnalyticsEvent;
  analytics = inject(Analytics);
  mixpanel = inject(MixpanelService);

  buyClick() {
    logEvent(this.analytics, this.events.NGCB2_BUY_CLICK);
    this.mixpanel.logEvent(MixpanelEvent.NGCB2_BUY_CLICK);
  }

  gitHubClick() {
    logEvent(this.analytics, this.events.NGCB2_GH_CLICK);
    this.mixpanel.logEvent(MixpanelEvent.NGCB2_GH_CLICK);
  }
}
