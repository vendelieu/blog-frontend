import { afterNextRender, ChangeDetectorRef, Component, Input } from '@angular/core';
import { PaginatorEntity } from '../../interfaces/paginator';
import {
  faAnglesLeft,
  faAnglesRight,
  faArrowDownShortWide,
  faArrowUpShortWide,
  faPlus
} from '@fortawesome/free-solid-svg-icons';
import { SortType } from '../../interfaces/posts';
import { PaginationService } from '../../services/pagination.service';
import { Options } from '../../config/site-options';
import { Router } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-page-bar',
  templateUrl: './page-bar.component.html',
  standalone: true,
  imports: [FontAwesomeModule],
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
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {
    afterNextRender(() => {
      if (localStorage.getItem(Options.STORAGE_ADMIN_MARK) === '1') {
        this.isAdmin = true;
        this.cdr.detectChanges();
      }
    });
  }

  addPost() {
    this.router.navigate(['/admin/post']);
  }

  changeSort(newSort: SortType) {
    this.paginationService.changeSort(newSort);
  }

  changePage(newPage: number) {
    this.paginationService.changePage(newPage);

    const urlTree = this.router.createUrlTree([], {
      queryParams: { page: newPage },
      queryParamsHandling: 'merge',
      preserveFragment: true
    });
    this.router.navigateByUrl(urlTree);
  }

  counter(size: number) {
    return new Array(size);
  }
}
