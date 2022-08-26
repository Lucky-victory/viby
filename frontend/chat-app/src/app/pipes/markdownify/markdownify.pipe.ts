import { Pipe, PipeTransform } from '@angular/core';
import {marked} from 'marked';
import hljs from 'highlight.js';

import { decode } from 'html-entities';

@Pipe({
  name: 'markdownify'
})
export class MarkdownifyPipe implements PipeTransform {

  transform(value: string,): string {
    marked.setOptions({
      highlight: function(code, lang) {
  
        const language = hljs.getLanguage(lang) ? lang : 'plaintext';
        return hljs.highlight(code,{language}).value;
      },
      langPrefix: 'hljs language-'
    });
  
    const html = marked.parse(value);
    return html;
  }

}
