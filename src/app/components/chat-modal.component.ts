import {
  Component,
  ViewChild,
  ElementRef,
  OnInit,
  OnDestroy,
  viewChild,
  output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService, Message } from '../services/chat.service';
import { Subscription } from 'rxjs';
import { MarkdownComponent } from './markdown/markdown.component';
@Component({
  selector: 'app-chat-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, MarkdownComponent],
  template: `
    <div class="flex h-[80vh] flex-col w-[90vw] md:w-[50vw] mx-auto">
      <div
        class="flex justify-between items-center p-4  bg-slate-200 dark:bg-slate-900 rounded-xl mb-1"
      >
        <h2 class="text-lg font-semibold">Ask NG Cookbook AI</h2>
        <button
          (click)="closeModal()"
          class="text-gray-500 hover:text-gray-800 text-2xl"
        >
          &times;
          <!-- Close icon -->
        </button>
      </div>
      <div
        #chatContainer
        class="flex-1 space-y-6 overflow-y-auto rounded-xl bg-slate-200 p-4 text-sm leading-6 text-slate-900 shadow-sm dark:bg-slate-900 dark:text-slate-300 sm:text-base sm:leading-7"
      >
        @for (message of messages; track message.id) { @if (message.role ===
        'user') {
        <div class="flex items-start">
          <img
            class="mr-2 h-8 w-8 rounded-full"
            src="assets/images/person-placeholder.png"
          />
          <div
            class="flex rounded-b-xl rounded-tr-xl bg-slate-50 p-4 dark:bg-slate-800 sm:max-w-md md:max-w-2xl"
          >
            <app-markdown [content]="message.content"></app-markdown>
          </div>
        </div>
        } @else {
        <div class="flex flex-row-reverse items-start">
          <img class="ml-2 h-8 w-8 rounded-full" src="assets/images/bot.png" />

          <div
            class="flex min-h-[85px] rounded-b-xl rounded-tl-xl bg-slate-50 p-4 dark:bg-slate-800 sm:min-h-0 sm:max-w-md md:max-w-2xl"
          >
            <app-markdown [content]="message.content"></app-markdown>
          </div>
        </div>
        } @if (message.role === 'assistant') {
        <div class="grid grid-cols-1 md:grid-cols-2 gap-2 place-content-end">
          @for (suggestion of suggestedQuestions; track suggestion) {
          <button
            (click)="sendMessage(suggestion)"
            class="px-2 py-1 bg-gray-200 hover:bg-indigo-500 hover:text-white dark:hover:bg-indigo-600 dark:hover:text-white dark:bg-slate-800 rounded text-sm"
          >
            {{ suggestion }}
          </button>
          } @if(!loading && !streamingMessage) {
          <button
            [disabled]="loading || streamingMessage"
            (click)="regenerateResponse(message)"
            class="px-2 py-1 bg-gray-200 hover:bg-indigo-500 hover:text-white dark:hover:bg-indigo-600 dark:hover:text-white dark:bg-slate-800 rounded text-sm"
            [ngClass]="{ 'col-span-2': suggestedQuestions.length === 0 }"
          >
            Regenerate
          </button>
          }
        </div>
        } } @empty {
        <div
          class="h-full w-full flex flex-col justify-center items-center gap-4"
        >
          <img src="assets/images/bot.png" class="h-36 w-36" />
          <div class="text-center text-slate-500 text-3xl">
            Ask me anything about the
            <br />
            <a
              href="https://amzn.to/4awwLgH"
              class="hover:text-indigo-500 underline"
              target="_blank"
              >Angular Cookbook</a
            >
          </div>
        </div>
        } @if(loading && !streamingMessage) {
        <div class="flex flex-row-reverse items-center justify-start">
          <img class="ml-2 h-8 w-8 rounded-full" src="assets/images/bot.png" />
          <!-- Adjust size as needed -->
          <ng-container [ngTemplateOutlet]="loadingSpinner" ]></ng-container>
        </div>
        } @if(streamingMessage) {
        <div class="flex flex-row-reverse items-start">
          <img class="ml-2 h-8 w-8 rounded-full" src="assets/images/bot.png" />

          <div
            class="flex min-h-[85px] rounded-b-xl rounded-tl-xl bg-slate-50 p-4 dark:bg-slate-800 sm:min-h-0 sm:max-w-md md:max-w-2xl"
          >
            <app-markdown [content]="streamingMessage"></app-markdown>
          </div>
          <div
            class="mr-2 mt-1 flex flex-col-reverse gap-2 text-slate-500 sm:flex-row"
          >
            <button class="hover:text-indigo-600" type="button">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path
                  d="M8 8m0 2a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2z"
                ></path>
                <path
                  d="M16 8v-2a2 2 0 0 0 -2 -2h-8a2 2 0 0 0 -2 2v8a2 2 0 0 0 2 2h2"
                ></path>
              </svg>
            </button>
            <button class="hover:text-indigo-600" type="button">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path
                  d="M7 13v-8a1 1 0 0 0 -1 -1h-2a1 1 0 0 0 -1 1v7a1 1 0 0 0 1 1h3a4 4 0 0 1 4 4v1a2 2 0 0 0 4 0v-5h3a2 2 0 0 0 2 -2l-1 -5a2 3 0 0 0 -2 -2h-7a3 3 0 0 0 -3 3"
                ></path>
              </svg>
            </button>
            <button class="hover:text-indigo-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path
                  d="M7 11v8a1 1 0 0 1 -1 1h-2a1 1 0 0 1 -1 -1v-7a1 1 0 0 1 1 -1h3a4 4 0 0 0 4 -4v-1a2 2 0 0 1 4 0v5h3a2 2 0 0 1 2 2l-1 5a2 3 0 0 1 -2 2h-7a3 3 0 0 1 -3 -3"
                ></path>
              </svg>
            </button>
          </div>
        </div>

        <div class="flex mt-4 items-center justify-center">
          <ng-container [ngTemplateOutlet]="loadingSpinner" ]></ng-container>
        </div>
        }
      </div>
      <!-- Prompt message input -->
      <form class="mt-2" (submit)="sendMessage()">
        <label for="chat-input" class="sr-only">Enter your prompt</label>
        <div class="relative">
          <button
            type="button"
            class="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-600"
          >
            <svg
              aria-hidden="true"
              class="h-5 w-5"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              stroke-width="2"
              stroke="currentColor"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
              <path
                d="M9 2m0 3a3 3 0 0 1 3 -3h0a3 3 0 0 1 3 3v5a3 3 0 0 1 -3 3h0a3 3 0 0 1 -3 -3z"
              ></path>
              <path d="M5 10a7 7 0 0 0 14 0"></path>
              <path d="M8 21l8 0"></path>
              <path d="M12 17l0 4"></path>
            </svg>
            <span class="sr-only">Use voice input</span>
          </button>
          <textarea
            #textInput
            id="chat-input"
            class="block w-full resize-none rounded-xl border-none bg-slate-200 p-4 pl-10 pr-20 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600 dark:bg-slate-900 dark:text-slate-200 dark:placeholder-slate-400 dark:focus:ring-indigo-600 sm:text-base"
            placeholder="Enter your prompt"
            rows="1"
            required
            [(ngModel)]="userInput"
            [ngModelOptions]="{ standalone: true }"
            (keyup.enter)="sendMessage()"
            autofocus
          ></textarea>
          <button
            [disabled]="loading || streamingMessage"
            type="submit"
            class="disabled:opacity-50 disabled:cursor-not-allowed absolute bottom-2 right-2.5 rounded-lg bg-indigo-700 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-indigo-800 focus:outline-none focus:ring-4 focus:ring-indigo-300 dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800 sm:text-base"
          >
            Send <span class="sr-only">Send message</span>
          </button>
        </div>
      </form>
      <ng-template #loadingSpinner>
        <svg
          class="animate-spin h-8 w-8 text-indigo-500"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          ></path>
        </svg>
      </ng-template>
    </div>
  `,
})
export class ChatModalComponent implements OnInit, OnDestroy {
  @ViewChild('chatContainer') private chatContainer!: ElementRef;
  textInput = viewChild.required<ElementRef<HTMLTextAreaElement>>('textInput');
  userInput = '';
  messages: Message[] = [];
  streamingMessage = '';
  suggestedQuestions: string[] = [];
  loading = false;
  close = output<void>();
  private subscriptions: Subscription[] = [];

  constructor(private chatService: ChatService) {}

  ngOnInit() {
    this.subscriptions.push(
      this.chatService.messages$.subscribe((messages) => {
        this.messages = messages;
        if (
          messages.length > 0 &&
          messages.at(-1)?.content === 'Sorry, an error occurred.'
        ) {
          this.loading = false;
        }
        this.scrollToBottom();
      }),
      this.chatService.streamingMessage$.subscribe((content) => {
        if (content === 'ACTION: streaming_done') {
          this.loading = false;
          this.streamingMessage = '';
        } else {
          this.streamingMessage += content;
        }
        this.scrollToBottom();
      }),
      this.chatService.suggestedQuestions$.subscribe((questions) => {
        this.suggestedQuestions = questions;
        this.scrollToBottom();
      })
    );
    this.textInput().nativeElement.focus();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  async sendMessage(content: string = this.userInput) {
    if (content.trim() === '' || this.loading || this.streamingMessage) return;
    this.loading = true;
    this.userInput = '';
    this.streamingMessage = '';
    this.suggestedQuestions = [];
    await this.chatService.sendMessage(content);
  }

  async regenerateResponse(message: Message) {
    const index = this.messages.indexOf(message);
    if (index > 0 && this.messages[index - 1].role === 'user') {
      const userMessage = this.messages[index - 1].content;
      this.messages.splice(index, 1);
      await this.sendMessage(userMessage);
    }
  }

  private scrollToBottom(): void {
    try {
      setTimeout(() => {
        this.chatContainer.nativeElement.scrollTop =
          this.chatContainer.nativeElement.scrollHeight;
      }, 100);
    } catch (err) {}
  }

  closeModal() {
    this.close.emit();
  }
}
