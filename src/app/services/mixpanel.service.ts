import { Injectable, isDevMode } from '@angular/core';
import * as MixpanelM from 'mixpanel-browser';

const init = MixpanelM.default.init;

export enum MixpanelEvent {
  NGCB2_GH_CLICK = 'GitHub Button Click',
  NGCB2_BUY_CLICK = 'Buy Button Click',
  NGCB2_CHATAI_OPEN = 'Chat AI Open',
  NGCB2_CHATAI_CLOSE = 'Chat AI Close',
  NGCB2_CHATAI_QUERY = 'Chat AI Query',
  NGCB2_CHATAI_RESPONSE = 'Chat AI Response',
  NGCB2_CHAT_SUGGESTION_CLICK = 'Chat Suggestion Click',
  NGCB2_CHAT_REGENERATE_CLICK = 'Chat Regenerate Click',
  NGCB2_CHAT_REQUEST_ERROR = 'Chat Request Error',
}

@Injectable({
  providedIn: 'root',
})
export class MixpanelService {
  mixPanel!: MixpanelM.Mixpanel;

  init() {
    if (isDevMode()) {
      return;
    }
    this.mixPanel = init(
      '03339a5c7d66566da91a0f2f2e6fae93',
      {
        debug: true,
        track_pageview: true,
        persistence: 'localStorage',
      },
      'ng-cookbook'
    );
  }

  logEvent(event: MixpanelEvent, meta?: any) {
    if (isDevMode()) {
      return;
    }
    if (meta) {
      return this.mixPanel.track(event, meta);
    }
    this.mixPanel.track(event);
  }
}
