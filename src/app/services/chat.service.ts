import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject, BehaviorSubject } from 'rxjs';

export interface Message {
  id: string;
  createdAt: string;
  role: 'user' | 'assistant';
  content: string;
  annotations?: any[];
}

interface StreamChunk {
  type: 'content' | 'event' | 'suggested_questions' | 'sources';
  data: any;
}

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private apiUrl = 'http://localhost:8000/api/chat';
  private messagesSubject = new BehaviorSubject<Message[]>([]);
  private streamingMessageSubject = new Subject<string>();
  private suggestedQuestionsSubject = new Subject<string[]>();

  messages$ = this.messagesSubject.asObservable();
  streamingMessage$ = this.streamingMessageSubject.asObservable();
  suggestedQuestions$ = this.suggestedQuestionsSubject.asObservable();

  constructor(private http: HttpClient) {}

  sendMessage(content: string): void {
    const newMessage: Message = {
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      role: 'user',
      content,
    };
    const currentMessages = this.messagesSubject.getValue();
    this.messagesSubject.next([...currentMessages, newMessage]);

    this.http
      .post(
        this.apiUrl,
        { messages: this.messagesSubject.getValue() },
        { responseType: 'text' }
      )
      .subscribe({
        next: (response) => {
          this.handleStreamingResponse(response);
        },
        error: (error) => {
          console.error('Error:', error);
          this.addAssistantMessage('Sorry, an error occurred.');
        },
      });
  }

  private handleStreamingResponse(response: string): void {
    let assistantMessage = '';
    const chunks = response.split('\n');

    chunks.forEach((chunk) => {
      if (chunk.trim() === '') return;

      const parsedChunk = this.parseChunk(chunk);
      if (parsedChunk) {
        switch (parsedChunk.type) {
          case 'content':
            assistantMessage += parsedChunk.data;
            this.streamingMessageSubject.next(parsedChunk.data);
            break;
          case 'suggested_questions':
            this.suggestedQuestionsSubject.next(parsedChunk.data);
            break;
          case 'event':
          case 'sources':
            // Handle events and sources if needed
            console.log(parsedChunk.type, parsedChunk.data);
            break;
        }
      }
    });

    if (assistantMessage) {
      this.addAssistantMessage(assistantMessage);
    }
  }

  private parseChunk(chunk: string): StreamChunk | null {
    if (chunk.startsWith('0:')) {
      return { type: 'content', data: chunk.slice(2).replace(/^"|"$/g, '') };
    }
    if (chunk.startsWith('8:')) {
      try {
        const parsed = JSON.parse(chunk.slice(2));
        if (Array.isArray(parsed) && parsed.length > 0) {
          const { type, data } = parsed[0];
          return { type, data };
        }
      } catch (e) {
        console.error('Error parsing chunk:', e);
      }
    }
    return null;
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 8);
  }

  private addAssistantMessage(content: string): void {
    const newMessage: Message = {
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      role: 'assistant',
      content,
    };
    const currentMessages = this.messagesSubject.getValue();
    this.messagesSubject.next([...currentMessages, newMessage]);
  }
}
