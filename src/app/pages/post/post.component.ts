import { DOCUMENT, ViewportScroller } from '@angular/common';
import {
  Component,
  ElementRef,
  Inject,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as QRCode from 'qrcode';
import { MessageService } from '../../components/message/message.service';
import { MetaService } from '../../core/meta.service';
import { UrlService } from '../../core/url.service';
import { NavPost, NodeEl, PostEntity, PostEntity_DefaultInst } from '../../interfaces/posts';
import { PostsService } from '../../services/posts.service';
import { Options } from '../../config/site-options';
import { Tag } from '../../interfaces/tag';
import {
  faAnglesLeft,
  faAnglesRight,
  faEnvelope,
  faQrcode
} from '@fortawesome/free-solid-svg-icons';
import { PaginatorService } from '../../core/paginator.service';
import { faFacebookSquare, faLinkedin, faTwitterSquare } from '@fortawesome/free-brands-svg-icons';
import { PaginationService } from '../../services/pagination.service';
import { environment } from '../../../environments/environment';
import { HighlightService } from '../../services/highlight.service';
import { Subscription } from 'rxjs';

type shareType = 'twitter' | 'linkedin' | 'facebook' | 'email';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.less']
})
export class PostComponent implements OnInit, OnDestroy {
  relatedPosts: NavPost[] | undefined;
  post: PostEntity = PostEntity_DefaultInst;
  postTags: Tag[] | null = [];
  clickedImage!: HTMLImageElement | string;
  showImgModal = false;
  commentsShow = false;
  imgModalPadding = 0;
  qrCodeIcon = faQrcode;
  linkedinIcon = faLinkedin;
  twitterIcon = faTwitterSquare;
  facebookIcon = faFacebookSquare;
  emailIcon = faEnvelope;
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
    private _meta: MetaService,
    private urlService: UrlService,
    private message: MessageService,
    private paginator: PaginatorService,
    private paginationService: PaginationService,
    private scroller: ViewportScroller,
    private _renderer2: Renderer2,
    private activatedRoute: ActivatedRoute,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.activatedRoute.data.subscribe(({ postEntity }) => {
      this.postSlug = postEntity.slug;
      this.post = postEntity;
      this._meta.updateHTMLMeta({
        title: `${postEntity.title} - ${Options.site_name}`,
        description: postEntity.description,
        keywords: postEntity.tags?.map((item: Tag) => item.name).join(',') ?? Options.site_keywords,
        image: postEntity.image,
        url: Options.site_url + '/' + postEntity.slug
      });

      this.loadContent();
    });
  }

  ngOnInit() {
    this.paramListener = this.route.params.subscribe((params) => {
      this.postSlug = params['postSlug'];
      this.postsService.getPostBySlug(this.postSlug).subscribe((post) => {
        if (!post) return;
        this.post = post;
        this.loadContent();
      });
    });
  }

  ngOnDestroy() {
    this.paramListener.unsubscribe();
    this.document.getElementById('vuukle-js')?.remove();
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
    } else if (type === 'facebook') {
      location.href = 'https://www.facebook.com/sharer/sharer.php?u=' + this.shareUrl;
    } else if (type === 'email') {
      location.href =
        'mailto:info@example.com?&subject=' +
        this.post.title +
        '&cc=&bcc=&body=' +
        this.shareUrl +
        '%0A' +
        this.post.description;
    }
  }

  toggleComments() {
    this.commentsShow = !this.commentsShow;
  }

  private loadContent() {
    this.commentsShow = false;
    this.postTags = this.post.tags;
    this.shareUrl = Options.site_url + '/' + this.post.slug;

    this._meta.updateHTMLMeta({
      title: `${this.post.title} - ${Options.site_name}`,
      description: this.post.description,
      keywords: this.post.tags?.map((item) => item.name).join(',') ?? Options.site_keywords,
      image: this.post.image,
      url: this.shareUrl
    });

    this.scroller.scrollToPosition([0, 0]);
    setTimeout(() => this.prepareContent(), 0);
    this.fetchRelated();
  }

  private fetchRelated() {
    this.postsService.getRelatedPostBySlug(this.postSlug).subscribe((navs) => {
      this.relatedPosts = navs;
    });
  }

  private prepareContent() {
    this.tocElements = [];
    this.collectContentHeadings();
    this.highlightService.highlightAll();
    setTimeout(() => this.initComments(), 0);
  }

  private generateShareQrcode() {
    QRCode.toCanvas(this.shareUrl + '?ref=qrcode', {
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

  private initComments(): void {
    if (this.document.getElementById('vuukle-js')) return;

    let script = this._renderer2.createElement('script');
    script.type = 'text/javascript';
    script.id = 'vuukle-js';
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
      const cur = el as NodeEl;
      if (!cur.localName) {
        return;
      }
      if (cur?.localName.startsWith('h')) this.tocElements.push(cur);
    });
  }
}
