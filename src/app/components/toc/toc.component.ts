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
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");
        if(!id) return
        const rect = entry.target.getBoundingClientRect();
        this.drawPath(id, rect);
      }
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

  drawPath(id: string, rect: DOMRect) {
    const svg = this.tocLine.nativeElement;
    const path = this.document.getElementById(id);
    if (!path) return;

    // Calculate the starting and ending points of the path
    const start = this.currentPath ? this.currentPath.end : 0;
    const end = rect.top - svg.getBoundingClientRect().top;

    // Update the current path
    this.currentPath = { start, end };
    // todo complete
  }
}
