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
  ) {}

  ngOnChanges() {
    this.sanitizedContent = this.sanitizeContent(
      this.processContent(this.content)
    );
  }

  private processContent(content: string): string {
    content = content.replace(/\\n\\n/g, '  \n'); // Replace \n with Markdown line break
    content = content.replace(/(?!\s)\\n/g, '\n'); // Replace \n with Markdown line break
    return this.preprocessCitations(
      this.preprocessMedia(this.preprocessLaTeX(content))
    );
  }

  private preprocessLaTeX(content: string): string {
    // Replace block-level LaTeX delimiters \[ \] with $$ $$
    const blockProcessedContent = content.replace(
      /\\\[([\s\S]*?)\\\]/g,
      (_, equation) => `$$${equation}$$`
    );
    // Replace inline LaTeX delimiters \( \) with $ $
    return blockProcessedContent.replace(
      /\\\(([\s\S]*?)\\\)/g,
      (_, equation) => `$${equation}$`
    );
  }

  private preprocessMedia(content: string): string {
    // Remove `sandbox:` from the beginning of the URL
    return content.replace(/(sandbox|attachment|snt):/g, '');
  }

  private preprocessCitations(content: string): string {
    if (this.sources) {
      const citationRegex = /\[citation:(.+?)\]\(\)/g;
      let match;
      while ((match = citationRegex.exec(content)) !== null) {
        const citationId = match[1];
        const sourceNode = this.sources.nodes.find(
          (node) => node.id === citationId
        );
        if (sourceNode !== undefined) {
          content = content.replace(
            match[0],
            `[citation:${this.sources.nodes.indexOf(sourceNode)}]()`
          );
        } else {
          content = content.replace(match[0], '');
        }
      }
    }
    return content;
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
      return this.sanitizer.bypassSecurityTrustHtml(parsedContent);
    } else {
      return parsedContent.then((result) =>
        this.sanitizer.bypassSecurityTrustHtml(result)
      );
    }
  }
}
