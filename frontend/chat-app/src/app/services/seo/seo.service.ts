import { Injectable } from '@angular/core';
import { Meta, MetaDefinition, Title } from '@angular/platform-browser';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SeoService {
  private title = new Subject<string>();
  title$ = this.title.asObservable();
  constructor(private readonly meta: Meta, private readonly pageTitle: Title) {}

  setTitle(title: string) {
    this.title.next(title);
    this.pageTitle.setTitle(title);
  }
  setMetaTag(tag: MetaDefinition, forceCreation = true) {
    this.meta.addTag(tag);
  }
  setMetaTags(tags: MetaDefinition[], forceCreation = true) {
    this.meta.addTags(tags, forceCreation);
  }
  updateMetaTags(tag: MetaDefinition, selector: string) {
    this.meta.updateTag(tag, selector);
  }
}
