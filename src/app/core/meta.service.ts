import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { HTMLExtendedData } from '../interfaces/meta';

@Injectable({
  providedIn: 'root'
})
export class MetaService {
  constructor(private meta: Meta, private title: Title) {}

  updateHTMLMeta(metaData: HTMLExtendedData) {
    if (metaData.title) {
      this.title.setTitle(metaData.title);
      this.meta.updateTag({
        property: 'og:title',
        content: metaData.title
      });
    }
    if (metaData.description) {
      this.meta.updateTag({
        name: 'description',
        content: metaData.description
      });
      this.meta.updateTag({
        property: 'og:description',
        content: metaData.description
      });
    }
    if (metaData.keywords) {
      this.meta.updateTag({
        name: 'keywords',
        property: 'keywords',
        content: metaData.keywords
      });
    }

    if (metaData.url) {
      this.meta.updateTag({
        property: 'og:url',
        content: metaData.url
      });
    }

    if (metaData.image) {
      this.meta.updateTag({
        property: 'og:image',
        content: metaData.image
      });
    }
  }
}
