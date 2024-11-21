import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DebugService {
  private platformId = inject(PLATFORM_ID);
  private debugEnabled = new BehaviorSubject<boolean>(false);
  debug$ = this.debugEnabled.asObservable();

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      // Initialize debug state from environment or window
      const initialState =
        typeof window !== 'undefined' &&
        (window.DEBUG || window.localStorage.getItem('DEBUG'));
      this.debugEnabled.next(!!initialState);
    }
  }

  enableDebug() {
    if (isPlatformBrowser(this.platformId)) {
      window.DEBUG = true;
      this.debugEnabled.next(true);
    }
  }

  disableDebug() {
    if (isPlatformBrowser(this.platformId)) {
      window.DEBUG = false;
      this.debugEnabled.next(false);
    }
  }

  isDebugEnabled(): boolean {
    return this.debugEnabled.value;
  }
}
