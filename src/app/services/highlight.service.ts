import 'prismjs';
import 'prismjs/plugins/toolbar/prism-toolbar';
import 'prismjs/plugins/line-numbers/prism-line-numbers';
import 'prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-kotlin.js';
import 'prismjs/components/prism-typescript';
import { Injectable } from '@angular/core';

declare var Prism: any;

@Injectable()
export class HighlightService {
  constructor() {}

  highlightAll() {
    Prism.highlightAll();
  }
}
