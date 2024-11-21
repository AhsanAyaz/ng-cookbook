import {
  afterNextRender,
  Component,
  inject,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MixpanelService } from './services/mixpanel.service';
import { DebugService } from './services/debug.service';

@Component({
    selector: 'app-root',
    imports: [CommonModule, RouterOutlet],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ng-cookbook';
  mixpanel = inject(MixpanelService);
  private debugService = inject(DebugService);

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    // Check for Ctrl + Shift + U
    if (event.ctrlKey && event.shiftKey && event.key === 'U') {
      const newState = !this.debugService.isDebugEnabled();
      if (newState) {
        this.debugService.enableDebug();
        console.log('🐛 Debug mode enabled');
      } else {
        this.debugService.disableDebug();
        console.log('🚫 Debug mode disabled');
      }
      event.preventDefault(); // Prevent default browser behavior
    }
  }

  constructor() {
    afterNextRender(() => {
      this.mixpanel.init();
    });
  }
}
