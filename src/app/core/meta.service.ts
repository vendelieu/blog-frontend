import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { HTMLMetaData } from '../interfaces/meta';

@Injectable({
  providedIn: 'root'
})
export class MetaService {
  constructor(
    private meta: Meta,
    private title: Title
  ) {
  }

  updateHTMLMeta(metaData: HTMLMetaData) {
    if (metaData.title) {
      this.title.setTitle(metaData.title);
    }
    if (metaData.description) {
      const descTag = this.meta.getTag('name="description"');
      this.meta[descTag ? 'updateTag' : 'addTag']({
        name: 'description',
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
  }
}
