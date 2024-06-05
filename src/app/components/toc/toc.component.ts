import { Component, ElementRef, HostListener, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { NodeEl, TocElement } from '../../interfaces/posts';
import { DOCUMENT } from '@angular/common';
import { PlatformService } from '../../services/platform.service';

@Component({
  selector: 'app-toc',
  templateUrl: './toc.component.html',
  standalone: true,
  styleUrls: ['./toc.component.less'],
  imports: []
})
export class TocComponent implements OnInit {
  tocList: TocElement[] = [];
  @Input('tocTarget') tocTargetElementRef!: NodeEl[];
  @Input('baseUrl') baseUrl!: string;

  @ViewChild('tocPath') tocPathEl?: ElementRef;
  private readonly intersectionObserver?: IntersectionObserver;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private platform: PlatformService
  ) {
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
          this.drawLine();
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
    this.refresh();
  }

  refresh() {
    this.tocList = [];
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

    if (!this.intersectionObserver) return;
    this.document.querySelectorAll('div#toc-target *[id]').forEach((section) => {
      this.intersectionObserver?.observe(section);
    });
  }

  @HostListener('window:resize', ['$event'])
  private drawLine() {
    const path: (string | number)[] = [];
    const intersected = Array.from(this.document.getElementsByClassName('toc-active'));

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

    this.tocPathEl?.nativeElement.setAttribute('d', path.join(' '));
  }
}
