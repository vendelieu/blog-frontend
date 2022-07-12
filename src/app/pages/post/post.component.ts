import { DOCUMENT, ViewportScroller } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { uniq } from 'lodash';
import * as QRCode from 'qrcode';
import { combineLatestWith, Subscription } from 'rxjs';
import { MessageService } from '../../components/message/message.service';
import { CommonService } from '../../core/common.service';
import { MetaService } from '../../core/meta.service';
import { PageComponent } from '../../core/page.component';
import { UrlService } from '../../core/url.service';
import { UserAgentService } from '../../core/user-agent.service';
import { Comment, CommentDTO } from '../../interfaces/comments';
import { OptionEntity } from '../../interfaces/options';
import { NavPost, PostEntity, Sort } from '../../interfaces/posts';
import { UserModel } from '../../interfaces/users';
import { CommentsService } from '../../services/comments.service';
import { PostsService } from '../../services/posts.service';
import { UsersService } from '../../services/users.service';
import { Options } from '../../config/site-options';
import { Tag } from '../../interfaces/tag';
import { MarkdownService } from 'ngx-markdown';
import { STORAGE_COMMENTS_SORTING_KEY } from '../../config/constants';
import {
  faAnglesLeft,
  faAnglesRight,
  faArrowDownShortWide,
  faArrowUpShortWide,
  faHashtag,
  faQrcode
} from '@fortawesome/free-solid-svg-icons';
import { PaginatorEntity } from '../../interfaces/paginator';
import { PaginatorService } from '../../core/paginator.service';
import { faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { tap } from 'rxjs/operators';

type actionType = 'reply' | 'update';
type shareType = 'twitter' | 'linkedin';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.less']
})
export class PostComponent extends PageComponent implements OnInit, OnDestroy {
  isMobile = false;
  isLoggedIn = false;
  user: UserModel | undefined;
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
  saveLoading = false;
  replyMode = false;
  updateCommentId: number | undefined = undefined;
  actionTrigger: Record<number, actionType> = {};
  commentarySort = 'newest';
  formGroupConfig = this.fb.group({
    content: ['', [Validators.required, Validators.maxLength(400)]],
    reply_to: []
  });
  actionForm: FormGroup = this.formGroupConfig;
  commentsLoad = false;
  commentsPage = 0;
  total = 0;
  paginatorData: PaginatorEntity | null = null;
  commentsPageUrl = '';
  pageUrlParam: Params = {};
  comments: Map<number, Comment> | undefined = undefined;
  commentValues: Comment[] | undefined = undefined;
  commentsLoading = false;
  qrCodeIcon = faQrcode;
  linkedinIcon = faLinkedin;
  twitterIcon = faHashtag;
  sortNewestIcon = faArrowDownShortWide;
  sortOldestIcon = faArrowUpShortWide;
  nextIcon = faAnglesRight;
  prevIcon = faAnglesLeft;
  shareUrl = '';

  private id: number = -0;
  private postSlug = '';
  private options: OptionEntity = Options;
  private referer = '';
  private urlListener!: Subscription;
  private paramListener!: Subscription;
  private userListener!: Subscription;
  private readonly headerHeight!: number;

  constructor(
    private postsService: PostsService,
    private commonService: CommonService,
    private commentsService: CommentsService,
    private usersService: UsersService,
    private route: ActivatedRoute,
    private metaService: MetaService,
    private urlService: UrlService,
    private userAgentService: UserAgentService,
    private fb: FormBuilder,
    private message: MessageService,
    private scroller: ViewportScroller,
    private markdownService: MarkdownService,
    private paginator: PaginatorService,
    @Inject(DOCUMENT) private document: Document
  ) {
    super();
    this.isMobile = this.userAgentService.isMobile();
    this.headerHeight = this.isMobile ? 56 : 60;
  }

  ngOnInit(): void {
    this.urlListener = this.urlService.urlInfo$.subscribe((url) => {
      this.referer = url.previous;
    });
    this.paramListener = this.route.paramMap.pipe(
      combineLatestWith(this.route.queryParamMap),
      tap(([params, queryParams]) => {
        this.postSlug = params.get('postSlug')?.trim() ?? '';
        this.commentsPage = Number(queryParams.get('page')) || 1;
      })
    ).subscribe(() => {
      this.fetchPost();
      this.scroller.scrollToPosition([0, 0]);
      this.fetchRelated();
    });
    this.commentarySort = localStorage.getItem(STORAGE_COMMENTS_SORTING_KEY) || 'newest';
    this.userListener = this.usersService.loginUser$.subscribe((user) => {
      this.isLoggedIn = this.usersService.isLoggedIn;
      this.user = user;
    });
  }

  ngOnDestroy() {
    this.urlListener.unsubscribe();
    this.paramListener.unsubscribe();
    this.userListener?.unsubscribe();
  }

  changeSort(newSort: string) {
    this.commentarySort = newSort;
    this.fetchComments(() => {
      this.scroller.scrollToAnchor('comments');
    });
    localStorage.setItem(STORAGE_COMMENTS_SORTING_KEY, newSort);
  }

  saveComment(form: FormGroup | undefined) {
    if (form && !form.valid) {
      this.checkForm(form);
      return;
    }

    let commentDto: CommentDTO = {
      post_slug: this.postSlug,
      text: form?.get('content')?.value ?? '',
      reply_to: form?.get('reply_to')?.value ?? null
    };

    this.saveLoading = true;
    this.commentsService.saveComment(commentDto).subscribe((res) => {
      this.saveLoading = false;
      if (res.code == 200) {
        this.message.success('Successfully added');
        const cachedReplyMode = this.replyMode;
        this.resetCommentForm(form);
        this.fetchComments(() => {
          !cachedReplyMode && this.scroller.scrollToAnchor('comments');
        });
      }
    });
  }

  deleteComment(comment: Comment) {
    this.saveLoading = true;
    this.commentsService.deleteComment(comment).subscribe((res) => {
      this.saveLoading = false;
      if (res.code == 200) {
        this.message.success('Successfully deleted');
        this.fetchComments(() => {
          this.scroller.scrollToAnchor('comments');
        });
      }
    });
  }

  updateComment(form: FormGroup) {
    if (form && !form.valid) {
      this.checkForm(form);
      return;
    }

    this.saveLoading = true;
    this.commentsService.updateComment(this.updateCommentId ?? 0, form?.get('content')?.value ?? '').subscribe((res) => {
      this.saveLoading = false;
      if (res.code == 200) {
        this.cancelUpdateMode(form);
        this.message.success('Successfully updated');
        this.fetchComments(() => {
          this.scroller.scrollToAnchor('comments');
        });
      }
    });
  }

  turnUpdateMode(comment: Comment, form: FormGroup) {
    this.resetVisible();
    this.actionTrigger[comment.id] = 'update';
    this.updateCommentId = comment.id;

    form.markAsUntouched();
    form.markAsPristine();
    form.get('content')?.setValue(comment.text);
  }

  cancelUpdateMode(form: FormGroup) {
    this.resetCommentForm(form);
  }

  toggleImgModal(status: boolean) {
    this.showImgModal = status;
  }

  replyComment(comment: Comment, form: FormGroup) {
    this.resetCommentForm(form);
    this.actionTrigger[comment.id] = 'reply';
    this.replyMode = true;
    form.get('reply_to')?.setValue(comment.id);
  }

  cancelReply() {
    this.resetVisible();
  }

  scrollToComment(e: MouseEvent) {
    const hash = (e.target as HTMLElement).dataset['hash'] || '';
    const offsetTop = this.document.getElementById(hash)?.offsetTop || 0;
    if (offsetTop > 0) {
      this.scroller.scrollToPosition([0, offsetTop - this.headerHeight]);
    }
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

  protected updateActivePage(): void {
    this.commonService.updateActivePage(this.pageIndex);
  }

  private checkForm(form: FormGroup) {
    const formLabels: Record<string, string> = {
      content: 'Content'
    };
    const msgs: string[] = [];
    Object.keys(form.controls).forEach((key) => {
      const ctrl = form.get(key);
      const errors = ctrl?.errors;
      errors && ctrl?.markAsTouched({ onlySelf: true });
      errors &&
      Object.keys(errors).forEach((type) => {
        switch (type) {
          case 'required':
            msgs.push(`Please enter ${formLabels[key]}`);
            break;
          case 'maxlength':
            msgs.push(`${formLabels[key]} length should be no greater than ${errors[type].requiredLength} character, currently ${errors[type].actualLength}`);
            break;
        }
      });
    });
    msgs.length > 0 && this.message.error(msgs[0]);
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
    this.commentsLoad = false;
    this.comments = undefined;
    this.commentValues = undefined;
    this.updateActivePage();
    this.initMeta();
    this.shareUrl = Options.site_url + '/' + this.post.slug;
  }

  loadComments() {
    this.commentsLoad = true;
    this.commentsLoading = true;
    this.fetchComments();
    this.commentsLoading = false;
    this.resetCommentForm(this.actionForm);
  }

  hideComments() {
    this.commentsLoad = false;
    this.resetCommentForm(this.actionForm);
  }

  private fetchComments(cb?: Function) {
    let sortParam: Sort;
    if (this.commentarySort === 'oldest') sortParam = Sort.oldest;
    else sortParam = Sort.newest;

    this.commentsService.getCommentsByPostSlug(this.postSlug, sortParam, this.commentsPage).subscribe((res) => {
      res?.data?.forEach((i) => this.comments?.set(i.id, i));
      this.commentValues = res?.data;
      this.total = res?.total_elements ?? 0;
      this.commentsPage = res?.page_num ?? 1;
      this.paginator.setPageSize(res?.page_size ?? 9);
      this.paginatorData = this.paginator.getPaginator(this.commentsPage, this.total);
    });
    cb && cb();
  }

  private resetCommentForm = (form: FormGroup | undefined) => {
    if (!form) return;
    this.resetVisible();
    form.markAsUntouched();
    form.markAsPristine();
    form.get('content')?.setValue('');
  };

  private resetVisible() {
    this.actionTrigger = {};
    this.replyMode = false;
    this.updateCommentId = undefined;
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
}
