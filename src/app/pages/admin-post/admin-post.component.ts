import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { PostsService } from '../../services/posts.service';
import { PostEntity, PostEntity_DefaultInst } from '../../interfaces/posts';
import { TagsService } from '../../services/tags.service';
import { NewTag, Tag, UpdatableTag } from '../../interfaces/tag';
import { TagModel } from 'ngx-chips/core/tag-model';
import { FormBuilder } from '@angular/forms';
import { MessageService } from '../../components/message/message.service';
import { TinyMceConfig } from '../../config/tiny-mce-config';
import { ThemeService } from '../../services/theme.service';
import { HTMLMetaData } from '../../interfaces/meta';
import { Options } from '../../config/site-options';
import { MetaService } from '../../core/meta.service';
import { ImagesService } from '../../services/images.service';
import { slugify } from '../../helpers/slugify';

@Component({
  selector: 'app-admin-post',
  templateUrl: './admin-post.component.html',
  styleUrls: ['./admin-post.component.less']
})
export class AdminPostComponent implements OnInit, OnDestroy {
  post: PostEntity = PostEntity_DefaultInst;
  isDark = false;
  postForm = this.fb.group({
    title: [''],
    image: [''],
    content: [''],
    description: [''],
    commentaries_open: false,
    slug: ['']
  });
  protected readonly TinyMCEConfig = TinyMceConfig;
  private paramListener!: Subscription;
  private postSlug = '';
  private tags: string[] = [];
  private newTags: NewTag[] = [];
  private addTags: string[] = [];
  private removeTags: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private postsService: PostsService,
    private tagService: TagsService,
    private message: MessageService,
    private router: Router,
    private fb: FormBuilder,
    private themeService: ThemeService,
    private imagesService: ImagesService,
    private metaService: MetaService
  ) {
    themeService.getFlow().subscribe((e) => {
      this.isDark = e === 'dark';
      if (this.isDark) {
        this.TinyMCEConfig.skin = 'oxide-dark';
        this.TinyMCEConfig.content_css = 'dark';
      } else {
        this.TinyMCEConfig.skin = 'oxide';
        this.TinyMCEConfig.content_css = 'default';
      }
    });
  }

  ngOnInit(): void {
    this.paramListener = this.route.params.subscribe((params) => {
      this.postSlug = params['postSlug']?.trim();
      if (this.postSlug)
        this.postsService.getPostBySlug(this.postSlug).subscribe((post) => {
          if (post) {
            this.post = post;
            this.tags = post.tags?.map((tag) => tag.slug) || [];
            this.postForm.setValue({
              title: post.title,
              image: post.image,
              content: post.content,
              description: post.description,
              commentaries_open: post.commentaries_open,
              slug: post.slug
            });
            this.initMeta();
          }
        });
    });
  }

  requestAutocompleteItems = (text: string): Observable<Tag[] | undefined> => {
    return this.tagService.getByName(text);
  };

  onTagAdd($event: TagModel): void {
    let tag = $event as UpdatableTag;
    if (tag.value != null) {
      this.newTags.push({
        name: tag.name,
        slug: slugify(tag.value)
      });
    } else {
      this.addTags.push(tag.slug);
      this.removeTags = this.removeTags.filter((t) => t !== tag.slug);
    }
  }

  onTagRemove($event: TagModel): void {
    let tag = $event as UpdatableTag;
    if (tag.slug) this.removeTags.push(tag.slug);
    else this.newTags = this.newTags.filter((t) => t.name !== tag.value);
  }

  handleTags(postSlug: string) {
    new Set(this.newTags).forEach((i) => {
      this.tagService.create(i).subscribe();
      this.tagService.link(postSlug, i.slug).subscribe();
    });
    new Set(this.addTags).forEach((t) => {
      if (this.tags.includes(t)) return;
      this.tagService.link(postSlug, t).subscribe();
    });
    new Set(this.removeTags).forEach((t) => {
      this.tagService.unlink(postSlug, t).subscribe();
    });
  }

  send() {
    if (this.postSlug)
      this.postsService.updatePostById(this.post.id, this.postForm.value).subscribe((_) => {
        this.handleTags(this.postSlug);
        this.message.success('Post updated.');
      });
    else
      this.postsService.createPost(this.postForm.value).subscribe((_) => {
        this.postForm.reset();
        this.handleTags(this.postForm.value.slug!);
        this.message.success('Post created.');
      });
  }

  onSlugChange() {
    let oldSlug = this.postForm.get('slug')?.value?.trim();
    if (!oldSlug) return;
    let newSlug = slugify(oldSlug);
    this.postForm.patchValue({ slug: newSlug });
  }

  delete() {
    this.postsService.deletePost(this.post.id).subscribe((res) => {
      this.message.success('Post deleted.');
      this.router.navigate(['/']);
    });
  }

  ngOnDestroy() {
    this.paramListener.unsubscribe();
  }

  onImageChange() {
    const imageUrl = this.postForm.get('image')?.value;
    if (!imageUrl) return;
    this.imagesService.saveImage(imageUrl).subscribe((img) => {
      this.postForm.patchValue({ image: img.url });
    });
  }

  private initMeta() {
    const metaData: HTMLMetaData = {
      title: Options.site_name + ' [ADM] - ' + this.post.title,
      description: Options.site_description,
      keywords: Options.site_keywords
    };
    this.metaService.updateHTMLMeta(metaData);
  }
}
