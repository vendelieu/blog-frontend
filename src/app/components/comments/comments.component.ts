import { Component, ElementRef, Input, Renderer2, ViewChild } from '@angular/core';
import { ThemeService } from '../../services/theme.service';

import 'giscus';
import { collectResultSync } from '@lit-labs/ssr/lib/render-result';
import { html, render } from '@lit-labs/ssr';
import { PlatformService } from '../../core/platform.service';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.less']
})
export class CommentsComponent {
  theme: string = 'dark';
  @Input('show') showComments!: boolean;
  isExpanded = false;
  @ViewChild('comments') commentsEl!: ElementRef;

  constructor(
    private renderer: Renderer2,
    private platform: PlatformService,
    themeService: ThemeService
  ) {
    this.isExpanded = false;
    if (this.platform.isServer) {
      const giscusComponent = collectResultSync(render(html`
        <giscus-widget
          id='comments'
          repo='vendelieu/blog-frontend'
          repoid='R_kgDOHo0zig'
          category='Comments'
          categoryid='DIC_kwDOHo0zis4CXkRl'
          mapping='og:title'
          data-strict='1'
          reactionsenabled='1'
          emitmetadata='0'
          inputposition='top'
          [attr.theme]='theme'
          theme='{{theme}}'
          lang='en'
          loading='lazy'
        ></giscus-widget>`));

      this.renderer.setProperty(this.commentsEl.nativeElement, 'innerHTML', giscusComponent);
    }
    themeService.getFlow().subscribe((e) => {
      this.theme = e;
    });
  }

  toggleComments() {
    this.isExpanded = !this.isExpanded;
  }
}
