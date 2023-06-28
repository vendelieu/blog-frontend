import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { HTMLExtendedData } from '../interfaces/meta';

@Injectable({
  providedIn: 'root'
})
export class MetaService {
  constructor(private meta: Meta, private title: Title) {}

  updateTitle(title: string) {
    this.title.setTitle(title);
    this.meta.updateTag({
      property: 'og:title',
      content: title
    });
    this.meta.updateTag({
      name: 'twitter:title',
      content: title
    });
  }

  updateDescription(description: string) {
    this.meta.updateTag({
      name: 'description',
      content: description
    });
    this.meta.updateTag({
      property: 'og:description',
      content: description
    });
    this.meta.updateTag({
      name: 'twitter:description',
      content: description
    });
  }

  updateKeywords(keywords: string) {
    this.meta.updateTag({
      name: 'keywords',
      property: 'keywords',
      content: keywords
    });
  }

  updateUrl(url: string) {
    this.meta.updateTag({
      property: 'og:url',
      content: url
    });
  }

  updateImage(image: string) {
    this.meta.updateTag({
      property: 'og:image',
      content: image
    });
    this.meta.updateTag({
      name: 'twitter:image',
      content: image
    });
  }

  updateHTMLMeta(metaData: HTMLExtendedData) {
    if (metaData.title) {
      this.updateTitle(metaData.title);
    }
    if (metaData.description) {
      this.updateDescription(metaData.description);
    }
    if (metaData.keywords) {
      this.updateKeywords(metaData.keywords);
    }
    if (metaData.url) {
      this.updateUrl(metaData.url);
    }
    if (metaData.image) {
      this.updateImage(metaData.image);
    }
  }
}
