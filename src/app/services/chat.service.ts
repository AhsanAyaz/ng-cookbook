import { Injectable, inject } from '@angular/core';
import { PLATFORM_ID } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DebugService } from './debug.service';

declare global {
  interface Window {
    DEBUG?: boolean;
  }
}

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
  private platformId = inject(PLATFORM_ID);
  private apiUrl = environment.chatApiUrl;
  private messagesSubject = new BehaviorSubject<Message[]>([]);
  private streamingMessageSubject = new Subject<string>();
  private suggestedQuestionsSubject = new Subject<string[]>();
  private debugService = inject(DebugService);

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
        if (response.status === 429) {
          this.addAssistantMessage(
            'Too many requests. Please wait a while before asking more questions.'
          );
          this.streamingMessageSubject.next('ACTION: streaming_done');
          return;
        }
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

    try {
      this.debug('Starting to handle streaming response');
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          this.debug('Reader signals done');
          break;
        }

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
                if (assistantMessage) {
                  this.suggestedQuestionsSubject.next(parsedChunk.data);
                }
                break;
              case 'event':
              case 'sources':
                this.debug(parsedChunk.type, parsedChunk.data);
                break;
            }
          }
        }
      }

      if (assistantMessage.trim()) {
        this.addAssistantMessage(assistantMessage);
      }
    } catch (error) {
      this.debug('Error in streaming response:', error);
      console.error('Error in streaming response:', error);
      this.streamingMessageSubject.next('');
    } finally {
      this.debug('Sending streaming done signal');
      this.streamingMessageSubject.next('ACTION: streaming_done');
    }
  }

  private parseChunk(chunk: string): StreamChunk | null {
    this.debug('Parsing chunk:', chunk);

    if (chunk.startsWith('0:')) {
      try {
        const rawContent = chunk.slice(2).replace(/^"|"$/g, '');
        this.debug('Raw content before decode:', rawContent);

        const decodedContent = decodeURIComponent(rawContent);
        this.debug('Decoded content:', decodedContent);

        return {
          type: 'content',
          data: decodedContent,
        };
      } catch (e) {
        this.debug('Error decoding content chunk:', {
          error: e,
          originalChunk: chunk,
          slicedContent: chunk.slice(2),
        });
        // Fallback parsing without decoding
        const fallbackContent = chunk.slice(2).replace(/^"|"$/g, '');
        this.debug('Using fallback content:', fallbackContent);
        return {
          type: 'content',
          data: fallbackContent,
        };
      }
    }

    if (chunk.startsWith('8:')) {
      try {
        const rawEventData = chunk.slice(2);
        this.debug('Raw event data before decode:', rawEventData);

        const decodedEventData = decodeURIComponent(rawEventData);
        this.debug('Decoded event data:', decodedEventData);

        const parsed = JSON.parse(decodedEventData);
        this.debug('Parsed event data:', parsed);

        if (Array.isArray(parsed) && parsed.length > 0) {
          const { type, data } = parsed[0];
          return { type, data };
        }
        this.debug('Invalid event data format:', parsed);
      } catch (e) {
        this.debug('Error parsing event chunk:', {
          error: e,
          originalChunk: chunk,
          slicedContent: chunk.slice(2),
        });
        return null;
      }
    }

    this.debug('Unknown chunk format, skipping:', chunk);
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

  private debug(message: string, ...args: any[]) {
    if (this.debugService.isDebugEnabled()) {
      console.log(`[ChatService] ${message}`, ...args);
    }
  }
}
