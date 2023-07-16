import { Component, ElementRef, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { NodeEl, TocElement } from '../../interfaces/posts';
import { DOCUMENT } from '@angular/common';
import { PlatformService } from '../../core/platform.service';

@Component({
  selector: 'app-toc',
  templateUrl: './toc.component.html',
  styleUrls: ['./toc.component.less']
})
export class TocComponent implements OnInit {
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

          let prevLvl = 0;
          intersected.forEach((e, index) => {
            const rect = e.getBoundingClientRect();
            const curLvl = parseInt(e.classList[1].charAt(8));
            const x = rect.left + 12;
            const y = rect.top + rect.height;

            if (index === 0) {
              const correction = (curLvl - 1) * 5;
              path.push('M', x + correction, y - 20);
              path.push('L', x + correction, y);
              return;
            }
            prevLvl = parseInt(intersected[index - 1].classList[1].charAt(8));
            if (prevLvl !== curLvl) path.push('h', 10 * ((curLvl - prevLvl) / 2));
            path.push('v', 27);
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

  ngOnInit() {
    setTimeout(() => this.formToc(), 0);
  }

  formToc() {
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
