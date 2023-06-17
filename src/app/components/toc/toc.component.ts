import { AfterViewInit, Component, Inject, Input } from '@angular/core';
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

  constructor(@Inject(DOCUMENT) private document: Document, private platform: PlatformService) {
    if (this.platform.isBrowser) {
      this.intersectionObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((el) => {
            if (el.isIntersecting) this.document.getElementById('toc-' + el.target.id)?.classList.add('toc-active');
            else this.document.getElementById('toc-' + el.target.id)?.classList.remove('toc-active');
          });
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
      this.tocList?.push({ id: el.id, lvl: parseInt(el.localName.charAt(1)), name: el.textContent ?? '' });
    });

    this.document.querySelectorAll('div#toc-target *[id]').forEach((section) => {
      this.intersectionObserver?.observe(section);
    });
  }
}
