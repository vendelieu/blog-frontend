import {DOCUMENT, ViewportScroller} from '@angular/common';
import {Component, Inject, OnDestroy, OnInit, Renderer2, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {uniq} from 'lodash';
import * as QRCode from 'qrcode';
import {Subscription} from 'rxjs';
import {MessageService} from '../../components/message/message.service';
import {MetaService} from '../../core/meta.service';
import {UrlService} from '../../core/url.service';
import {OptionEntity} from '../../interfaces/options';
import {NavPost, NodeEl, PostEntity, TocElement} from '../../interfaces/posts';
import {PostsService} from '../../services/posts.service';
import {Options} from '../../config/site-options';
import {Tag} from '../../interfaces/tag';
import {faAnglesLeft, faAnglesRight, faHashtag, faQrcode} from '@fortawesome/free-solid-svg-icons';
import {PaginatorService} from '../../core/paginator.service';
import {faLinkedin} from '@fortawesome/free-brands-svg-icons';
import {PaginationService} from '../../services/pagination.service';
import {environment} from "../../../environments/environment";

type shareType = 'twitter' | 'linkedin';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.less']
})
export class PostComponent implements OnInit, OnDestroy {
  pageIndex: string = '';
  prevPost: NavPost | null = null;
  nextPost: NavPost | null = null;
  relatedPosts: NavPost[] | undefined = undefined;
  post: PostEntity = {
    commentaries_open: false,
    content: '',
    id: 0,
    image: '',
    next: null,
    prev: null,
    description: '',
    slug: '',
    tags: null,
    title: '',
    updated_at: Date.now() as unknown as Date
  };
  postTags: Tag[] | null = [];
  clickedImage!: HTMLImageElement | string;
  showImgModal = false;
  imgModalPadding = 0;
  commentsShow = false;
  qrCodeIcon = faQrcode;
  linkedinIcon = faLinkedin;
  twitterIcon = faHashtag;
  nextIcon = faAnglesRight;
  prevIcon = faAnglesLeft;
  shareUrl = '';
  tocList: TocElement[] | undefined = undefined;

  private id: number = -0;
  private postSlug = '';
  private options: OptionEntity = Options;
  private referer = '';
  private urlListener!: Subscription;
  private paramListener!: Subscription;

  constructor(
    private postsService: PostsService,
    private route: ActivatedRoute,
    private metaService: MetaService,
    private urlService: UrlService,
    private message: MessageService,
    private scroller: ViewportScroller,
    private paginator: PaginatorService,
    private paginationService: PaginationService,
    private _renderer2: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ) {
  }

  collectAndObserveToc() {
    this.tocList = [];
    const elements = this.document.getElementById('toc-target')?.childNodes;

    elements?.forEach((el) => {
      const cur = (el as unknown as NodeEl);
      if (!cur.localName) {
        return;
      }

      if (cur?.localName.startsWith('h')) this.tocList?.push({
          id: cur.id, lvl: cur.localName.charAt(1), name: cur.textContent ?? ''
        }
      );
    });

    const intersectionObserver = new IntersectionObserver(entries => {
      entries.forEach((el) => {
        if (el.intersectionRatio > 0)
          this.document.getElementById('toc-' + el.target.id)?.classList.add('toc-active');
        else this.document.getElementById('toc-' + el.target.id)?.classList.remove('toc-active');
      });
    });

    document.querySelectorAll('markdown#toc-target *[id]').forEach((section) => {
      intersectionObserver.observe(section);
    });
  }

  ngOnInit(): void {
    this.tocList = undefined;
    this.urlListener = this.urlService.urlInfo$.subscribe((url) => {
      this.referer = url.previous;
    });
    this.paramListener = this.route.params.subscribe((params) => {
      this.postSlug = params['postSlug']?.trim();
      this.fetchPost();
      this.scroller.scrollToPosition([0, 0]);
      this.fetchRelated();
    });
  }

  ngOnDestroy() {
    this.urlListener.unsubscribe();
    this.paramListener.unsubscribe();
  }

  toggleImgModal(status: boolean) {
    this.showImgModal = status;
  }

  showShareQrcode() {
    this.clickedImage = '';
    this.imgModalPadding = 16;
    this.showImgModal = true;
    setTimeout(() => this.generateShareQrcode(), 0);
  }

  shareButton(type: shareType) {
    if (type === 'twitter') {
      location.href = 'https://twitter.com/intent/tweet?url=' + this.shareUrl;
    } else if (type === 'linkedin') {
      location.href = 'https://www.linkedin.com/sharing/share-offsite/?url=' + this.shareUrl;
    }
  }

  private initMeta() {
    const keywords: string[] = (this.options['site_keywords'] || '').split(',');
    this.metaService.updateHTMLMeta({
      title: `${this.post.title} - ${this.options['site_name']}`,
      description: this.post.description,
      author: this.options['site_author'],
      keywords: uniq(this.postTags?.map((item) => item.name).concat(keywords)).join(',')
    });
  }

  private fetchPost() {
    this.postsService.getPostBySlug(this.postSlug).subscribe((post) => {
      if (post) {
        this.initData(post);
        this.prevPost = this.post.prev;
        this.nextPost = this.post.next;
      }
    });
  }

  private fetchRelated() {
    this.postsService.getRelatedPostBySlug(this.postSlug).subscribe((navs) => {
      this.relatedPosts = navs;
    });
  }

  private initData(post: PostEntity) {
    this.post = post;
    this.id = this.post.id;
    this.postTags = post.tags;
    this.pageIndex = post.title;
    this.initMeta();
    this.shareUrl = Options.site_url + '/' + this.post.slug;

    this.initComments();
  }

  toggleComments() {
    this.commentsShow = !this.commentsShow;
  }

  private generateShareQrcode() {
    this.shareUrl = this.shareUrl + '?ref=qrcode';

    QRCode.toCanvas(this.shareUrl, {
      width: 320,
      margin: 0
    })
      .then((canvas) => {
        const modalEle = this.document.querySelector('.modal-content-body');
        modalEle?.appendChild(canvas);
      })
      .catch((err) => {
        this.message.error(err);
      });
  }

  initComments(): void {
    if (!this.post.commentaries_open) {
      this.document.getElementById("comments")?.remove();
      return
    }

    let script = this._renderer2.createElement('script');
    script.type = 'text/javascript'
    script.text = `
      var VUUKLE_CONFIG = {
        apiKey: '${environment.comments_key}',
        articleId: '${this.postSlug}',
      };
      (function() {
        var d = document,
          s = d.createElement('script');
        s.src = 'https://cdn.vuukle.com/platform.js';
        (d.head || d.body).appendChild(s);
      })();
      `;
    this._renderer2.appendChild(this.document.body, script);
  }
}
