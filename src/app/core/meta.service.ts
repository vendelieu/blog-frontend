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
      const titleTag = this.meta.getTag('property="og:title"');
      this.meta[titleTag ? 'updateTag' : 'addTag']({
        property: 'og:title',
        content: metaData.title
      });
    }
    if (metaData.description) {
      const descTag = this.meta.getTag('name="description"');
      this.meta[descTag ? 'updateTag' : 'addTag']({
        name: 'description',
        content: metaData.description
      });
      const descriptionTag = this.meta.getTag('property="og:description"');
      this.meta[descriptionTag ? 'updateTag' : 'addTag']({
        property: 'og:description',
        content: metaData.description
      });
    }
    if (metaData.keywords) {
      const keywordsTag = this.meta.getTag('name="keywords"');
      this.meta[keywordsTag ? 'updateTag' : 'addTag']({
        name: 'keywords',
        content: metaData.keywords
      });
    }

    if (metaData.url) {
      const urlTag = this.meta.getTag('property="og:url"');
      this.meta[urlTag ? 'updateTag' : 'addTag']({
        property: 'og:url',
        content: metaData.url
      });
    }

    if (metaData.image) {
      const imageTag = this.meta.getTag('property="og:image"');
      this.meta[imageTag ? 'updateTag' : 'addTag']({
        property: 'og:image',
        content: metaData.image
      });
    }
  }
}
