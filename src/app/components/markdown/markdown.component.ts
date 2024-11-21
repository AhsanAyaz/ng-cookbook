import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeHtml } from '@angular/platform-browser';
import { MarkdownService } from 'ngx-markdown';
import { inject } from '@angular/core';
import { DebugService } from 'src/app/services/debug.service';

export type SourceNode = {
  id: string;
  metadata: Record<string, unknown>;
  score?: number;
  text: string;
  url: string;
};

export type SourceData = {
  nodes: SourceNode[];
};

@Component({
    selector: 'app-markdown',
    template: ` <div [innerHTML]="sanitizedContent"></div> `,
    imports: [CommonModule]
})
export class MarkdownComponent {
  @Input() content: string = '';
  @Input() sources?: SourceData;

  sanitizedContent: SafeHtml = '';
  private debugService = inject(DebugService);

  constructor(private markdownService: MarkdownService) {
    this.markdownService.renderer.link = (
      href: string,
      title: string,
      text: string
    ) => {
      return `<a href="${href}" target="_blank" class="text-indigo-600 underline hover:text-indigo-700" title="${title}">${text}</a>`;
    };
  }

  ngOnChanges() {
    this.debug('Content received:', this.content);
    this.sanitizedContent = this.sanitizeContent(
      this.processContent(this.content)
    );
  }

  private debug(message: string, ...args: any[]) {
    if (this.debugService.isDebugEnabled()) {
      console.log(`[MarkdownComponent] ${message}`, ...args);
    }
  }

  private processContent(content: string): string {
    try {
      this.debug('Processing content:', content);

      content = this.decodeUnicode(content);
      this.debug('After Unicode decode:', content);

      content = content.normalize();
      this.debug('After normalization:', content);

      content = content.replace(/\\n\\n/g, '\n\n');
      this.debug('After newline processing:', content);

      content = content.replace(/(?!\s)\\n/g, '  \n');
      this.debug('After line break processing:', content);

      return content;
    } catch (e) {
      this.debug('Error processing content:', {
        error: e,
        originalContent: content,
      });
      return content;
    }
  }

  private decodeUnicode(content: string): string {
    this.debug('Decoding Unicode for content:', content);
    try {
      const decoded = content.replace(/\\u[\dA-F]{4}/gi, (match) => {
        const charCode = parseInt(match.replace(/\\u/g, ''), 16);
        this.debug('Decoded Unicode match:', {
          original: match,
          charCode,
          result: String.fromCharCode(charCode),
        });
        return String.fromCharCode(charCode);
      });
      this.debug('Unicode decode result:', decoded);
      return decoded;
    } catch (e) {
      this.debug('Error decoding Unicode:', {
        error: e,
        content,
      });
      return content;
    }
  }

  private sanitizeContent(content: string) {
    let parsedContent: Promise<string> | string = '';
    try {
      this.debug('Sanitizing content:', content);

      parsedContent = this.markdownService.parse(content, {
        decodeHtml: true,
        inline: true,
        markedOptions: {
          gfm: true,
          breaks: true,
        },
      });

      if (typeof parsedContent === 'string') {
        this.debug('Parsed content (string):', parsedContent);
        const decodedContent = parsedContent;
        this.debug('Decoded content:', decodedContent);
        return decodedContent;
      } else {
        this.debug('Parsed content (promise):', parsedContent);
        return parsedContent.then((result) => {
          this.debug('Promise result:', result);
          return result;
        });
      }
    } catch (e) {
      if (typeof parsedContent !== 'string') {
        parsedContent.then((parsed) => {
          this.debug('Error sanitizing content:', {
            error: e,
            content,
            parsed,
          });
        });
      } else {
        this.debug('Error sanitizing content:', {
          error: e,
          content,
          parsedContent,
        });
      }
      return content;
    }
  }
}
