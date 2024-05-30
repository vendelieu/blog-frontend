import { Inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { HTMLExtendedData } from '../interfaces/meta';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class MetaService {
  constructor(private meta: Meta, private title: Title, @Inject(DOCUMENT) private dom: Document) {
  }

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

  updateType(type: string) {
    this.meta.updateTag({
      property: 'og:type',
      content: type
    });
  }

  addArticleModifiedDate(date: Date) {
    this.meta.addTag({
      property: 'article:modified_time',
      content: date.toString()
    });
  }

  updateHTMLMeta(metaData: HTMLExtendedData, articleUpdateDate?: Date) {
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
    if (articleUpdateDate) {
      this.updateType('article');
      this.addArticleModifiedDate(articleUpdateDate);
    }
  }

  updateCanonicalUrl(newUrl: string) {
    const element: HTMLLinkElement = this.dom.querySelector(`link[rel='canonical']`)!;
    element.href = newUrl;
  }
}
