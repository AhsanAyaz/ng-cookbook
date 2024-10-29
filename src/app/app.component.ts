import { afterNextRender, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MixpanelService } from './services/mixpanel.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'ng-cookbook';
  mixpanel = inject(MixpanelService);
  constructor() {
    afterNextRender(() => {
      this.mixpanel.init();
    });
  }
}
