import { DOCUMENT, ViewportScroller } from '@angular/common';
import { Component, ElementRef, Inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as QRCode from 'qrcode';
import { MessageService } from '../../components/message/message.service';
import { MetaService } from '../../core/meta.service';
import { NavPost, NodeEl, PostEntity } from '../../interfaces/posts';
import { PostsService } from '../../services/posts.service';
import { Options } from '../../config/site-options';
import { Tag } from '../../interfaces/tag';
import { faAnglesLeft, faAnglesRight, faEnvelope, faQrcode } from '@fortawesome/free-solid-svg-icons';
import { faFacebookSquare, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { HighlightService } from '../../services/highlight.service';
import { PlatformService } from '../../core/platform.service';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons/faPenToSquare';
import { CoolLocalStorage } from '@angular-cool/storage';
import { faXTwitter } from '@fortawesome/free-brands-svg-icons/faXTwitter';

type shareType = 'twitter' | 'linkedin' | 'facebook' | 'email';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.less']
})
export class PostComponent {
  relatedPosts?: NavPost[];
  post!: PostEntity;
  postTags: Tag[] | null = [];
  clickedImage!: HTMLImageElement | string;
  showImgModal = false;
  imgModalPadding = 0;
  qrCodeIcon = faQrcode;
  linkedinIcon = faLinkedin;
  twitterIcon = faXTwitter;
  facebookIcon = faFacebookSquare;
  emailIcon = faEnvelope;
  nextIcon = faAnglesRight;
  prevIcon = faAnglesLeft;
  editPostIcon = faPenToSquare;
  isAdmin = false;
  shareUrl = '';
  tocElements: NodeEl[] = [];
  @ViewChild('tocTarget') tocTargetEl!: ElementRef;

  private postSlug!: string;

  constructor(
    private postsService: PostsService,
    private highlightService: HighlightService,
    private _meta: MetaService,
    private message: MessageService,
    private scroller: ViewportScroller,
    private activatedRoute: ActivatedRoute,
    private platform: PlatformService,
    private router: Router,
    @Inject(DOCUMENT) private document: Document,
    localStorage: CoolLocalStorage
  ) {
    if (localStorage.getItem(Options.STORAGE_ADMIN_MARK) === '1') {
      this.isAdmin = true;
    }
    this.activatedRoute.data.subscribe(({ postEntity }) => {
      this.postSlug = postEntity.slug;
      this.post = postEntity;

      this._meta.updateHTMLMeta(
        {
          title: `${postEntity.title} - ${Options.site_name}`,
          description: postEntity.description,
          keywords:
            postEntity.tags?.map((item: Tag) => item.name).join(',') ?? Options.site_keywords,
          image: postEntity.image,
          url: this.shareUrl
        },
        postEntity.updated_at
      );

      this.loadContent();
    });
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

  editPostButton() {
    this.router.navigate(['/admin/post/' + this.post.slug]);
  }

  private loadContent() {
    this.postTags = this.post.tags;
    this.shareUrl = Options.site_url + '/' + this.post.slug;
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
    if (this.platform.isBrowser) {
      this.highlightService.highlightAll();
      this.scroller.scrollToPosition([0, 0]);
    }
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
