import {
  Component,
  ViewChild,
  ElementRef,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService, Message } from '../services/chat.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-chat-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl mx-auto">
      <h2 class="text-2xl font-bold mb-4">Chat</h2>
      <div #chatContainer class="h-96 overflow-y-auto mb-4 p-4 border rounded">
        <div *ngFor="let message of messages" class="mb-4">
          <div [ngClass]="{ 'text-right': message.role === 'user' }">
            <span
              [ngClass]="{
                'bg-blue-100 text-blue-800 p-2 rounded-lg inline-block':
                  message.role === 'user',
                'bg-gray-100 text-gray-800 p-2 rounded-lg inline-block':
                  message.role === 'assistant'
              }"
            >
              {{ message.content }}
            </span>
          </div>
          <div *ngIf="message.role === 'assistant'" class="mt-2">
            <button
              *ngFor="let suggestion of suggestedQuestions"
              (click)="sendMessage(suggestion)"
              class="mr-2 mb-2 px-2 py-1 bg-gray-200 rounded text-sm"
            >
              {{ suggestion }}
            </button>
          </div>
          <button
            *ngIf="message.role === 'assistant'"
            (click)="regenerateResponse(message)"
            class="text-xs text-blue-500 mt-1"
          >
            Regenerate
          </button>
        </div>
        <div *ngIf="streamingMessage" class="mb-4">
          <span class="bg-gray-100 text-gray-800 p-2 rounded-lg inline-block">{{
            streamingMessage
          }}</span>
        </div>
      </div>
      <div class="flex">
        <input
          [(ngModel)]="userInput"
          (keyup.enter)="sendMessage()"
          class="text-black flex-grow border rounded-l px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Type your message..."
        />
        <button
          (click)="sendMessage()"
          class="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Send
        </button>
      </div>
    </div>
  `,
})
export class ChatModalComponent implements OnInit, OnDestroy {
  @ViewChild('chatContainer') private chatContainer!: ElementRef;

  userInput = '';
  messages: Message[] = [];
  streamingMessage = '';
  suggestedQuestions: string[] = [];
  private subscriptions: Subscription[] = [];

  constructor(private chatService: ChatService) {}

  ngOnInit() {
    this.subscriptions.push(
      this.chatService.messages$.subscribe((messages) => {
        this.messages = messages;
        this.scrollToBottom();
      }),
      this.chatService.streamingMessage$.subscribe((content) => {
        this.streamingMessage += content;
        this.scrollToBottom();
      }),
      this.chatService.suggestedQuestions$.subscribe((questions) => {
        this.suggestedQuestions = questions;
        this.scrollToBottom();
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  sendMessage(content: string = this.userInput) {
    if (content.trim() === '') return;
    this.userInput = '';
    this.streamingMessage = '';
    this.suggestedQuestions = [];
    this.chatService.sendMessage(content);
  }

  regenerateResponse(message: Message) {
    const index = this.messages.indexOf(message);
    if (index > 0 && this.messages[index - 1].role === 'user') {
      const userMessage = this.messages[index - 1].content;
      this.messages.splice(index, 1);
      this.sendMessage(userMessage);
    }
  }

  private scrollToBottom(): void {
    try {
      this.chatContainer.nativeElement.scrollTop =
        this.chatContainer.nativeElement.scrollHeight;
    } catch (err) {}
  }
}
