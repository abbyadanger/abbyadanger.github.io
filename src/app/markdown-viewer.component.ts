import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

@Component({
  selector: 'app-markdown-viewer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './markdown-viewer.component.html',
  styleUrl: './app.css'
})
export class MarkdownViewerComponent {
  protected readonly title = signal('Markdown Viewer');
  protected readonly files = signal<string[]>(['docs/hello.md', 'docs/abby.md']);
  protected readonly src = signal<string>('docs/hello.md');
  protected readonly loading = signal<boolean>(true);
  protected readonly error = signal<string | null>(null);
  protected readonly html = signal<string>('');

  constructor() {
    marked.setOptions({ breaks: true, gfm: true });
    this.src.set(this.files()[0]);
    if (typeof window !== 'undefined') {
      this.load(this.src());
    }
  }

  selectFile(path: string) {
    this.src.set(path);
    this.load(path);
  }

  async load(path: string) {
    this.loading.set(true);
    this.error.set(null);
    try {
      const res = await fetch(path, { cache: 'no-cache' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const md = await res.text();
      const rawHtml = marked.parse(md) as string;
      const safe = DOMPurify.sanitize(rawHtml);
      this.html.set(safe);
    } catch (e: unknown) {
      this.error.set(e instanceof Error ? e.message : 'Failed to load markdown');
    } finally {
      this.loading.set(false);
    }
  }
}
