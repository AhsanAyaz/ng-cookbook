import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ChatModalComponent } from './chat-modal.component';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <button
      (click)="openChatModal()"
      class="btn btn-accent {{ btnClasses() }}"
      [ngClass]="!showText() ? 'btn-circle' : ''"
    >
      @if (showText()) {
      <span>Chat with AI</span>
      }
      <span
        class="p-2 rounded-full shadow-lg"
        [ngClass]="{
          'bg-slate-800': showText(),
          'bg-transparent': !showText()
        }"
      >
        <img src="assets/images/bot.png" alt="chat" class="w-6 h-6" />
      </span>
    </button>
  `,
})
export class ChatComponent {
  showText = input(false);
  private overlayRef: OverlayRef | null = null;
  btnClasses = input('');
  constructor(private overlay: Overlay) {}

  openChatModal() {
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = null;
    }

    const positionStrategy = this.overlay
      .position()
      .global()
      .centerHorizontally()
      .centerVertically();

    this.overlayRef = this.overlay.create({
      positionStrategy,
      hasBackdrop: true,
      scrollStrategy: this.overlay.scrollStrategies.block(),
    });

    const portal = new ComponentPortal(ChatModalComponent);
    const componentRef = this.overlayRef.attach(portal);

    componentRef.instance.close.subscribe(() => {
      this.overlayRef?.dispose();
      this.overlayRef = null;
    });

    this.overlayRef.backdropClick().subscribe(() => {
      this.overlayRef?.dispose();
      this.overlayRef = null;
    });
  }
}
