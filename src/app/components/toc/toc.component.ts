import {AfterViewInit, Component, ElementRef, Inject, Input, ViewChild} from "@angular/core";
import {NodeEl, TocElement} from "../../interfaces/posts";
import {DOCUMENT} from "@angular/common";

@Component({
  selector: 'app-toc',
  templateUrl: './toc.component.html',
  styleUrls: ['./toc.component.less']
})
export class TocComponent implements AfterViewInit {
  tocList: TocElement[] = [];
  @ViewChild('tocLine') tocLine!: ElementRef;
  @Input('tocTarget') tocTargetElementRef!: NodeEl[];
  @Input("baseUrl") baseUrl!: string

  private intersectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((el) => {
      if (el.isIntersecting)
        this.document.getElementById('toc-' + el.target.id)?.classList.add('toc-active');
      else this.document.getElementById('toc-' + el.target.id)?.classList.remove('toc-active');
    });
  }, {
    root: null,
    rootMargin: "0px",
    threshold: 0.5,
  })
  private currentPath: any = {
    start: 0,
    end: 0
  }

  constructor(
    @Inject(DOCUMENT) private document: Document,
  ) {
  }

  ngAfterViewInit() {
    this.tocTargetElementRef.forEach(el => {
      this.tocList?.push({id: el.id, lvl: parseInt(el.localName.charAt(1)), name: el.textContent ?? ''});
    });

    this.document.querySelectorAll('div#toc-target *[id]').forEach((section) => {
      this.intersectionObserver.observe(section);
    });
  }
}
