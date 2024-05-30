import { CommonModule, NgOptimizedImage, ViewportScroller } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { uniq } from 'lodash';
import { MetaService } from '../../services/meta.service';
import { PaginatorService } from '../../services/paginator.service';
import { HTMLMetaData } from '../../interfaces/meta';
import { PaginatorEntity } from '../../interfaces/paginator';
import { PostEntity, PostQueryParam, Sort } from '../../interfaces/posts';
import { PostsService } from '../../services/posts.service';
import { Options } from '../../config/site-options';
import { PaginationService } from '../../services/pagination.service';
import { PlatformService } from '../../services/platform.service';
import { PageBarComponent } from '../../components/page-bar/page-bar.component';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ImgFallbackModule } from 'ngx-img-fallback';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.less'],
  imports: [CommonModule, PageBarComponent, NgOptimizedImage, RouterLink, ImgFallbackModule],
  standalone: true
})
export class PostListComponent implements OnInit {
  @Input() query = '';
  @Input() tag = '';

  pageIndex = 'index';
  siteName = Options.site_name;
  page = 1;
  sort = 'newest';
  postList: PostEntity[] | undefined;
  total = 0;
  paginatorData: PaginatorEntity | null = null;

  constructor(
    private route: ActivatedRoute,
    private postsService: PostsService,
    private paginator: PaginatorService,
    private metaService: MetaService,
    private scroller: ViewportScroller,
    private paginationService: PaginationService,
    private platform: PlatformService
  ) {
    this.paginationService.sortingChanged.subscribe((newSort) => {
      this.sort = newSort;
      if (this.platform.isBrowser) {
        localStorage.setItem(Options.STORAGE_POSTS_SORTING_KEY, newSort);
      }
      if (this.platform.isBrowser) {
        this.sort = localStorage.getItem(Options.STORAGE_POSTS_SORTING_KEY) || 'newest';
        this.scroller.scrollToPosition([0, 0]);
      }
      this.fetchPosts();
    });
    this.paginationService.pageChanged.subscribe((newPage) => {
      this.page = newPage;
      this.fetchPosts();
      this.scroller.scrollToPosition([0, 0]);
    });
  }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((p) => {
      this.page = parseInt(p.get('page') ?? '1');
      this.fetchPosts();
      this.scroller.scrollToPosition([0, 0]);
    });
  }

  private fetchPosts() {
    let sortParam: Sort;
    if (this.sort === 'oldest') sortParam = Sort.oldest;
    else sortParam = Sort.newest;

    const param: PostQueryParam = {
      page: this.page,
      sort_by: sortParam
    };
    if (this.query) {
      param.keyword = this.query;
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
      if (this.query) {
        titles.unshift(this.query, 'Search');
        description += `「${this.query}」search results`;
        keywords.unshift(this.query);
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
    });
  }
}
