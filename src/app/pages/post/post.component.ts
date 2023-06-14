import {DOCUMENT, ViewportScroller} from '@angular/common';
import {Component, ElementRef, Inject, OnDestroy, OnInit, Renderer2, ViewChild, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {uniq} from 'lodash';
import * as QRCode from 'qrcode';
import {Subscription} from 'rxjs';
import {MessageService} from '../../components/message/message.service';
import {MetaService} from '../../core/meta.service';
import {UrlService} from '../../core/url.service';
import {NavPost, NodeEl, PostEntity, PostEntity_DefaultInst} from '../../interfaces/posts';
import {PostsService} from '../../services/posts.service';
import {Options} from '../../config/site-options';
import {Tag} from '../../interfaces/tag';
import {faAnglesLeft, faAnglesRight, faHashtag, faQrcode} from '@fortawesome/free-solid-svg-icons';
import {PaginatorService} from '../../core/paginator.service';
import {faLinkedin} from '@fortawesome/free-brands-svg-icons';
import {PaginationService} from '../../services/pagination.service';
import {environment} from "../../../environments/environment";
import {HighlightService} from "../../services/highlight.service";

type shareType = 'twitter' | 'linkedin';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.less']
})
export class PostComponent implements OnInit, OnDestroy {
  prevPost: NavPost | null = null;
  nextPost: NavPost | null = null;
  relatedPosts: NavPost[] | undefined;
  post: PostEntity = PostEntity_DefaultInst;
  postTags: Tag[] | null = [];
  clickedImage!: HTMLImageElement | string;
  showImgModal = false;
  commentsShow = false;
  imgModalPadding = 0;
  qrCodeIcon = faQrcode;
  linkedinIcon = faLinkedin;
  twitterIcon = faHashtag;
  nextIcon = faAnglesRight;
  prevIcon = faAnglesLeft;
  shareUrl = '';
  tocElements: NodeEl[] = [];
  @ViewChild('tocTarget') tocTargetEl!: ElementRef;

  private postSlug = '';
  private paramListener!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private postsService: PostsService,
    private highlightService: HighlightService,
    private metaService: MetaService,
    private urlService: UrlService,
    private message: MessageService,
    private paginator: PaginatorService,
    private paginationService: PaginationService,
    private scroller: ViewportScroller,
    private _renderer2: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ) {
  }

  ngOnInit(): void {
    this.paramListener = this.route.params.subscribe((params) => {
      this.postSlug = params['postSlug']?.trim();
      this.fetchPost();
      this.scroller.scrollToPosition([0, 0]);
      this.fetchRelated();
    });
  }

  ngOnDestroy() {
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
    const keywords: string[] = Options.site_keywords.split(',');
    this.metaService.updateHTMLMeta({
      title: `${this.post.title} - ${Options.site_name}`,
      description: this.post.description,
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
    this.postTags = post.tags;
    this.initMeta();
    this.shareUrl = Options.site_url + '/' + this.post.slug;
    setTimeout(() => this.prepareContent(), 0);
  }

  toggleComments() {
    this.commentsShow = !this.commentsShow;
  }

  private prepareContent() {
    if (this.post.id > 0) {
      this.collectContentHeadings();
      this.highlightService.highlightAll();
      this.initComments();
    }
  }

  private generateShareQrcode() {
    QRCode.toCanvas(this.shareUrl + '?ref=qrcode', {
      width: 320,
      margin: 0
    }).then((canvas) => {
      const modalEle = this.document.querySelector('.modal-content-body');
      modalEle?.appendChild(canvas);
    }).catch((err) => {
      this.message.error(err);
    });
  }

  private initComments(): void {
    if (!this.post.commentaries_open) {
      this.document.getElementById("comments")?.remove();
      return
    }
    if (this.document.getElementById('vuukle-js')) return;

    let script = this._renderer2.createElement('script');
    script.type = 'text/javascript'
    script.id = 'vuukle-js'
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

  private collectContentHeadings() {
    const elements = this.tocTargetEl.nativeElement?.childNodes;
    elements?.forEach((el: unknown) => {
      const cur = (el as NodeEl);
      if (!cur.localName) {
        return;
      }
      if (cur?.localName.startsWith('h')) this.tocElements?.push(cur)
    });
  }
}
