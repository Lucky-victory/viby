import { Pipe, PipeTransform } from '@angular/core';
import * as linkifyjs from 'linkifyjs';

import linkifyHtml from 'linkifyjs/lib/linkify-html';

/**
 * Finds links in a string and make them clickable
 */

@Pipe({
  name: 'linkify',
})
export class LinkifyPipe implements PipeTransform {
  /**
   *
   * @param input - the string to be parsed
   * @returns {SafeHtml} a sanitized string containing the links render as HTML tags
   */
  constructor() {}
  transform(input?: string, target: string = '_blank'): string {
    if (!input) {
      return '';
    }

    const linkifyOptions = {
      target: target,
      defaultProtocol: 'https',
      rel: 'nofollow noopener',
      className: 'link-in-chat',
    };
    const htmlStrings = linkifyHtml(input, linkifyOptions);

    return htmlStrings;
  }
}
