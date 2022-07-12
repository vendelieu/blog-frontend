import { ViewportScroller } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, Optional, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { RESPONSE } from '@nguniversal/express-engine/tokens';
import { Response } from 'express';
import { uniq } from 'lodash';
import { combineLatestWith, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CommonService } from '../../core/common.service';
import { MetaService } from '../../core/meta.service';
import { PageComponent } from '../../core/page.component';
import { PaginatorService } from '../../core/paginator.service';
import { UserAgentService } from '../../core/user-agent.service';
import { HTMLMetaData } from '../../interfaces/meta';
import { OptionEntity } from '../../interfaces/options';
import { PaginatorEntity } from '../../interfaces/paginator';
import { PostEntity, PostQueryParam, Sort } from '../../interfaces/posts';
import { PostsService } from '../../services/posts.service';
import { Options } from '../../config/site-options';
import { STORAGE_POSTS_SORTING_KEY } from '../../config/constants';
import { faSort } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.less']
})
export class PostListComponent extends PageComponent implements OnInit, OnDestroy {
  isMobile = false;
  pageIndex = 'index';
  options: OptionEntity = Options;
  page = 1;
  keyword = '';
  tag = '';
  sort = 'newest';
  postList: PostEntity[] | undefined = undefined;
  total = 0;
  paginatorData: PaginatorEntity | null = null;
  pageUrl = '';
  pageUrlParam: Params = {};
  sortIcon = faSort;

  private paramListener!: Subscription;

  constructor(
    @Inject(PLATFORM_ID) protected platform: Object,
    @Optional() @Inject(RESPONSE) protected response: Response,
    private route: ActivatedRoute,
    private postsService: PostsService,
    private commonService: CommonService,
    private paginator: PaginatorService,
    private metaService: MetaService,
    private userAgentService: UserAgentService,
    private scroller: ViewportScroller
  ) {
    super();
    this.isMobile = this.userAgentService.isMobile();
  }

  ngOnInit(): void {
    this.sort = localStorage.getItem(STORAGE_POSTS_SORTING_KEY) || 'newest';
    this.paramListener = this.route.paramMap
      .pipe(
        combineLatestWith(this.route.queryParamMap),
        tap(([params, queryParams]) => {
          this.page = Number(params.get('page')) || 1;
          this.tag = params.get('tag')?.trim() || '';
          this.keyword = queryParams.get('keyword')?.trim() || '';
        })
      )
      .subscribe(() => {
        this.fetchPosts();
        this.scroller.scrollToPosition([0, 0]);
      });
  }

  ngOnDestroy() {
    this.paramListener.unsubscribe();
  }

  changeSort(newSort: string) {
    this.sort = newSort;
    this.fetchPosts();
    localStorage.setItem(STORAGE_POSTS_SORTING_KEY, newSort);
  }

  protected updateActivePage(): void {
    this.commonService.updateActivePage(this.pageIndex);
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

      const siteName: string = this.options['site_name'] || '';
      let description: string = '';
      const titles: string[] = [siteName, Options.site_description];
      const tags: string[] = [];
      const keywords: string[] = (this.options['site_keywords'] || '').split(',');
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
      description += `${this.options['site_description']}`;
      if (titles.length === 1) {
        titles.unshift(this.options['site_slogan']);
      }
      const metaData: HTMLMetaData = {
        title: titles.join(' - '),
        description,
        author: this.options['site_author'],
        keywords: uniq(keywords).join(',')
      };
      this.metaService.updateHTMLMeta(metaData);

      this.updateActivePage();

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
