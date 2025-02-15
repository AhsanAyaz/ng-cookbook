import { Component, inject } from '@angular/core';
import { BehaviorsDirective } from '../directives/behaviors.directive';
import { FeatherModule } from 'angular-feather';
import { ChatComponent } from '../components/chat.component';
import { AnalyticsEvent } from '../constants/analyticsEvents';
import { MixpanelEvent } from '../services/mixpanel.service';
import { MixpanelService } from '../services/mixpanel.service';
import { DemoAppVideosComponent } from '../components/demo-app-videos/demo-app-videos.component';
@Component({
  selector: 'app-landing-personal',
  imports: [
    BehaviorsDirective,
    FeatherModule,
    ChatComponent,
    DemoAppVideosComponent,
  ],
  templateUrl: './landing-personal.component.html',
  styleUrl: './landing-personal.component.scss',
})
export class LandingPersonalComponent {
  events = AnalyticsEvent;
  mixpanel = inject(MixpanelService);

  buyClick() {
    this.mixpanel.logEvent(MixpanelEvent.NGCB2_BUY_CLICK);
  }

  gitHubClick() {
    this.mixpanel.logEvent(MixpanelEvent.NGCB2_GH_CLICK);
  }
}
