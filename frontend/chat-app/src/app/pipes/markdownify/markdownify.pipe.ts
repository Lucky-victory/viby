import { Pipe, PipeTransform } from '@angular/core';
import { marked } from 'marked';
import hljs from 'highlight.js';
marked.setOptions({
  highlight: function (code, lang) {
    const language = hljs.getLanguage(lang) ? lang : 'plaintext';
    return hljs.highlight(code, { language }).value;
  },
  langPrefix: 'hljs language-',
});

@Pipe({
  name: 'markdownify',
})
export class MarkdownifyPipe implements PipeTransform {
  transform(value: string): string {
    const html = marked.parse(value);
    return html;
  }
}
