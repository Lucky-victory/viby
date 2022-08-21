import { Injectable } from '@angular/core';
import { Meta, MetaDefinition, Title } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class SeoService {
  constructor(private readonly meta: Meta, private readonly pageTitle: Title) {}

  setTitle(title: string) {
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
