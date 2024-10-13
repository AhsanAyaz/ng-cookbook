import { Injectable } from '@angular/core';
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

  constructor() {}

  async sendMessage(content: string): Promise<void> {
    const newMessage: Message = {
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      role: 'user',
      content,
    };
    const currentMessages = this.messagesSubject.getValue();
    this.messagesSubject.next([...currentMessages, newMessage]);

    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: this.messagesSubject.getValue() }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Unable to read response');
      }

      await this.handleStreamingResponse(reader);
    } catch (error) {
      console.error('Error:', error);
      this.addAssistantMessage('Sorry, an error occurred.');
    }
  }

  private async handleStreamingResponse(
    reader: ReadableStreamDefaultReader<Uint8Array>
  ): Promise<void> {
    let assistantMessage = '';
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split('\n');

      for (const line of lines) {
        if (line.trim() === '') continue;

        const parsedChunk = this.parseChunk(line);
        if (parsedChunk) {
          if (parsedChunk.data === '') continue;
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
      }
    }

    if (assistantMessage) {
      this.addAssistantMessage(assistantMessage);
    }
    this.streamingMessageSubject.next('ACTION: streaming_done');
  }

  private parseChunk(chunk: string): StreamChunk | null {
    if (chunk.startsWith('0:')) {
      return {
        type: 'content',
        data: decodeURIComponent(chunk.slice(2).replace(/^"|"$/g, '')),
      };
    }
    if (chunk.startsWith('8:')) {
      try {
        const parsed = JSON.parse(decodeURIComponent(chunk.slice(2)));
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
