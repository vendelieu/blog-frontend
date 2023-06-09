import { Injectable, OnInit } from '@angular/core';
import { PaginatorEntity, PaginatorRange } from '../interfaces/paginator';
import {Options} from "../config/site-options";

@Injectable({
  providedIn: 'root'
})
export class PaginatorService {
  // todo: get from db:options
  private pageSize: number = Options.PAGINATOR_PAGE_SIZE;
  private paginationSize: number = Options.PAGINATOR_PAGINATION_SIZE;

  setPageSize(size: number) {
    this.pageSize = size;
  }

  getPageData(page: number, pages: number, paginationSize: number): PaginatorRange {
    const pageData: PaginatorRange = {
      start: 1,
      end: 1
    };
    const floorPage = Math.floor((paginationSize + 1) / 2);
    const ceilPage = Math.ceil((paginationSize - 1) / 2);

    if (pages <= paginationSize) {
      pageData.start = 1;
      pageData.end = pages;
    } else if (page <= floorPage) {
      pageData.start = 1;
      pageData.end = paginationSize;
    } else if (page > floorPage && page + ceilPage <= pages) {
      pageData.start = page - ceilPage + ((paginationSize + 1) % 2);
      pageData.end = page + ceilPage;
    } else {
      pageData.start = pages - paginationSize + 1;
      pageData.end = pages;
    }

    return pageData;
  }

  getPaginator(page: string | number, total: number): PaginatorEntity {
    let pages = Math.ceil(total / this.pageSize);
    if (typeof page === 'string') {
      page = parseInt(page, 10);
    }
    pages = pages || 1;
    page = Math.min(pages, page || 1);

    const pageData = this.getPageData(page, pages, this.paginationSize);

    return {
      startPage: pageData.start,
      endPage: pageData.end,
      prevPage: page <= 1 ? 0 : page - 1,
      nextPage: page >= pages ? 0 : page + 1,
      curPage: page,
      totalPage: pages,
      pageLimit: this.pageSize,
      total
    };
  }
}
