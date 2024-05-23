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
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';
import { CoolLocalStorage } from '@angular-cool/storage';
import { Options } from '../../config/site-options';
import { Router } from '@angular/router';

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
  newPostIcon = faPlus;
  isAdmin = false;

  constructor(
    private paginationService: PaginationService,
    private router: Router,
    localStorage: CoolLocalStorage
  ) {
    if (localStorage.getItem(Options.STORAGE_ADMIN_MARK) === '1') {
      this.isAdmin = true;
    }
  }

  addPost() {
    this.router.navigate(['/admin/post']);
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
