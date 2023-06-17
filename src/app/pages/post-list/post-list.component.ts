import { ViewportScroller } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { uniq } from 'lodash';
import { Subscription } from 'rxjs';
import { MetaService } from '../../core/meta.service';
import { PaginatorService } from '../../core/paginator.service';
import { HTMLMetaData } from '../../interfaces/meta';
import { PaginatorEntity } from '../../interfaces/paginator';
import { PostEntity, PostQueryParam, Sort } from '../../interfaces/posts';
import { PostsService } from '../../services/posts.service';
import { Options } from '../../config/site-options';
import { PaginationService } from '../../services/pagination.service';
import { CoolLocalStorage } from '@angular-cool/storage';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.less']
})
export class PostListComponent implements OnInit, OnDestroy {
  pageIndex = 'index';
  siteName = Options.site_name;
  page = 1;
  keyword = '';
  tag = '';
  sort = 'newest';
  postList: PostEntity[] | undefined;
  total = 0;
  paginatorData: PaginatorEntity | null = null;
  pageUrl = '';
  pageUrlParam: Params = {};

  private paramListener!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private postsService: PostsService,
    private paginator: PaginatorService,
    private metaService: MetaService,
    private scroller: ViewportScroller,
    private paginationService: PaginationService,
    private localStorage: CoolLocalStorage
  ) {}

  ngOnInit(): void {
    this.sort = this.localStorage.getItem(Options.STORAGE_POSTS_SORTING_KEY) || 'newest';
    this.paramListener = this.route.params.subscribe((params) => {
      this.tag = params['tag']?.trim() || '';
      this.keyword = params['keyword']?.trim() || '';
      this.page = params['page']?.trim() || this.page;
      this.fetchPosts();
      this.scroller.scrollToPosition([0, 0]);
    });
    this.paginationService.pageChanged.subscribe((newPage) => {
      this.page = newPage;
      this.fetchPosts();
      this.scroller.scrollToPosition([0, 0]);
    });
    this.paginationService.sortingChanged.subscribe((newSort) => {
      this.sort = newSort;
      this.localStorage.setItem(Options.STORAGE_POSTS_SORTING_KEY, newSort);
      this.fetchPosts();
      this.scroller.scrollToPosition([0, 0]);
    });
  }

  ngOnDestroy() {
    this.paramListener.unsubscribe();
  }

  private fetchPosts() {
    let sortParam: Sort;
    if (this.sort === 'oldest') sortParam = Sort.oldest;
    else sortParam = Sort.newest;

    const param: PostQueryParam = {
      page: this.page,
      sort_by: sortParam
    };
    if (this.keyword) {
      param.keyword = this.keyword;
    }
    if (this.tag) {
      this.pageIndex = 'tag';
      param.tags = this.tag;
    }
    this.postsService.getPosts(param).subscribe((res) => {
      this.postList = res?.data || undefined;
      this.page = res?.page_num || 1;
      this.total = res?.total_elements || 0;
      this.paginator.setPageSize(res?.page_size ?? 9);

      let description: string = '';
      const titles: string[] = [Options.site_name, Options.site_description];
      const tags: string[] = [];
      const keywords: string[] = Options.site_keywords.split(',');
      if (this.tag) {
        titles.unshift(this.tag);
        tags.push(this.tag);
        keywords.unshift(this.tag);
      }
      description += tags.length > 0 ? `「${tags.join('-')}」` : '';
      if (this.keyword) {
        titles.unshift(this.keyword, 'Search');
        description += `「${this.keyword}」search results`;
        keywords.unshift(this.keyword);
      } else {
        description += 'Articles list';
      }
      if (this.page > 1) {
        titles.unshift(`#${this.page} page`);
        description += `(#${this.page} page)`;
      }
      if (description === 'Articles list') {
        description = '';
      } else {
        description += '。';
      }
      description += `${Options.site_description}`;
      if (titles.length === 1) {
        titles.unshift(Options.site_slogan);
      }
      const metaData: HTMLMetaData = {
        title: titles.join(' - '),
        description,
        keywords: uniq(keywords).join(',')
      };
      this.metaService.updateHTMLMeta(metaData);

      this.paginatorData = this.paginator.getPaginator(this.page, this.total);
      const urlSegments = this.route.snapshot.url.map((url) => url.path);
      if (urlSegments.length < 1) {
        urlSegments.push('post');
      }
      if (this.route.snapshot.paramMap.get('page')) {
        urlSegments.splice(-1, 1, 'page-');
      } else {
        urlSegments.push('page-');
      }
      this.pageUrl = `/${urlSegments.join('/')}`;
      this.pageUrlParam = { ...this.route.snapshot.queryParams };
    });
  }
}
