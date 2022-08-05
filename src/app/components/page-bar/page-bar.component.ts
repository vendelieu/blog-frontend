import { Component, Input } from '@angular/core';
import { PaginatorEntity } from '../../interfaces/paginator';
import {
  faAnglesLeft,
  faAnglesRight,
  faArrowDownShortWide,
  faArrowUpShortWide
} from '@fortawesome/free-solid-svg-icons';
import { SortType } from '../../interfaces/posts';
import { PaginationService } from '../../services/pagination.service';

@Component({
  selector: 'app-page-bar',
  templateUrl: './page-bar.component.html',
  styleUrls: ['./page-bar.component.less']
})
export class PageBarComponent {
  @Input() curSort: string | undefined;
  @Input() paginator: PaginatorEntity | null = null;

  prevIcon = faAnglesLeft;
  nextIcon = faAnglesRight;
  sortNewestIcon = faArrowDownShortWide;
  sortOldestIcon = faArrowUpShortWide;

  constructor(private paginationService: PaginationService) {
  }

  changeSort(newSort: SortType) {
    this.paginationService.changeSort(newSort);
  }

  changePage(newPage: number) {
    this.paginationService.changePage(newPage);
  }

  counter(size: number) {
    return new Array(size);
  }
}
