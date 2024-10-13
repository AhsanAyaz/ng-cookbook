import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MarkdownService } from 'ngx-markdown';

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
  standalone: true,
  imports: [CommonModule],
})
export class MarkdownComponent {
  @Input() content: string = '';
  @Input() sources?: SourceData;

  sanitizedContent: SafeHtml = '';

  constructor(
    private sanitizer: DomSanitizer,
    private markdownService: MarkdownService
  ) {
    this.markdownService.renderer.link = (
      href: string,
      title: string,
      text: string
    ) => {
      return `<a href="${href}" target="_blank" class="text-indigo-600 underline hover:text-indigo-700" title="${title}">${text}</a>`;
    };
  }

  ngOnChanges() {
    this.sanitizedContent = this.sanitizeContent(
      this.processContent(this.content)
    );
  }

  private processContent(content: string): string {
    content = this.decodeUnicode(content);
    content = content.normalize(); // Normalize Unicode characters
    content = content.replace(/\\n\\n/g, '\n\n'); // Ensure double newlines are preserved for paragraph breaks
    content = content.replace(/(?!\s)\\n/g, '  \n'); // Replace \n not followed by whitespace with Markdown line break
    return content;
  }

  private decodeUnicode(content: string): string {
    // Decodes Unicode escape sequences like \u201c into actual characters
    return content.replace(/\\u[\dA-F]{4}/gi, (match) => {
      return String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16));
    });
  }

  private sanitizeContent(content: string): SafeHtml {
    const parsedContent = this.markdownService.parse(content, {
      decodeHtml: true,
      inline: true,
      markedOptions: {
        gfm: true,
        breaks: true,
      },
    });
    if (typeof parsedContent === 'string') {
      return this.sanitizer.bypassSecurityTrustHtml(
        decodeURIComponent(parsedContent)
      );
    } else {
      return parsedContent.then((result) =>
        this.sanitizer.bypassSecurityTrustHtml(result)
      );
    }
  }
}
