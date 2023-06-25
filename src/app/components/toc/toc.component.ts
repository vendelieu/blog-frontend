import { AfterViewInit, Component, ElementRef, Inject, Input, ViewChild } from '@angular/core';
import { NodeEl, TocElement } from '../../interfaces/posts';
import { DOCUMENT } from '@angular/common';
import { PlatformService } from '../../core/platform.service';

@Component({
  selector: 'app-toc',
  templateUrl: './toc.component.html',
  styleUrls: ['./toc.component.less']
})
export class TocComponent implements AfterViewInit {
  tocList: TocElement[] = [];
  @Input('tocTarget') tocTargetElementRef!: NodeEl[];
  @Input('baseUrl') baseUrl!: string;

  private intersectionObserver: IntersectionObserver | undefined;
  @ViewChild('tocPath') tocPathEl!: ElementRef;

  constructor(@Inject(DOCUMENT) private document: Document, private platform: PlatformService) {
    if (this.platform.isBrowser) {
      this.intersectionObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((el) => {
            const tocElement = this.document.getElementById('toc-' + el.target.id);
            if (el.isIntersecting) {
              tocElement?.classList.add('toc-active');
            } else {
              tocElement?.classList.remove('toc-active');
            }
          });
          const intersected = Array.from(this.document.getElementsByClassName('toc-active'));
          const path: (string | number)[] = [];

          let pathIndent: number;
          intersected.forEach((e, index) => {
            const rect = e.getBoundingClientRect();
            if (index === 0) {
              path.push('M', rect.left, rect.top + rect.height - 25);
              path.push('L', rect.left, rect.top + rect.height);
            } else {
              if (pathIndent !== rect.y)
                path.push('L', rect.left + 10, rect.top + rect.height - 10);
              path.push('L', rect.left, rect.top + rect.height);
            }
            pathIndent = rect.y;
          });

          this.tocPathEl.nativeElement.setAttribute('d', path.join(' '));
        },
        {
          root: null,
          rootMargin: '0px',
          threshold: 0.5
        }
      );
    }
  }

  ngAfterViewInit() {
    this.tocTargetElementRef.forEach((el) => {
      this.tocList?.push({
        id: el.id,
        lvl: parseInt(el.localName.charAt(1)),
        name: el.textContent ?? ''
      });
    });

    this.document.querySelectorAll('div#toc-target *[id]').forEach((section) => {
      this.intersectionObserver?.observe(section);
    });
  }
}
