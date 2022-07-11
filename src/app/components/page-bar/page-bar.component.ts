import { Component, Input } from '@angular/core';
import { Params } from '@angular/router';
import { UserAgentService } from '../../core/user-agent.service';
import { PaginatorEntity } from '../../interfaces/paginator';
import { faAnglesLeft, faAnglesRight } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-page-bar',
  templateUrl: './page-bar.component.html',
  styleUrls: ['./page-bar.component.less']
})
export class PageBarComponent {
  @Input() paginator: PaginatorEntity | null = null;
  @Input() url: string = '';
  @Input() param: Params = {};

  isMobile = false;
  prevIcon = faAnglesLeft;
  nextIcon = faAnglesRight;

  constructor(private userAgentService: UserAgentService) {
    this.isMobile = this.userAgentService.isMobile();
  }

  counter(size: number) {
    return new Array(size);
  }
}
