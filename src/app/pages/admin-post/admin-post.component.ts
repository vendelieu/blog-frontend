import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { PostsService } from '../../services/posts.service';
import { PostEntity, PostEntity_DefaultInst } from '../../interfaces/posts';
import { TagDTO } from '../../interfaces/tag';
import { FormBuilder, FormControl } from '@angular/forms';
import { MessageService } from '../../components/message/message.service';
import { TinyMceConfig } from '../../config/tiny-mce-config';
import { ThemeService } from '../../services/theme.service';
import { HTMLMetaData } from '../../interfaces/meta';
import { Options } from '../../config/site-options';
import { MetaService } from '../../core/meta.service';
import { ImagesService } from '../../services/images.service';
import { slugify } from '../../helpers/slugify';
import { CoolLocalStorage } from '@angular-cool/storage';
import { faUndo } from '@fortawesome/free-solid-svg-icons/faUndo';
import { TagsService } from '../../services/tags.service';

@Component({
  selector: 'app-admin-post',
  templateUrl: './admin-post.component.html',
  styleUrls: ['./admin-post.component.less']
})
export class AdminPostComponent implements OnInit, OnDestroy {
  post: PostEntity = PostEntity_DefaultInst;
  isDark = false;
  returnIcon = faUndo;
  postForm = this.fb.group({
    title: '',
    image: '',
    content: '',
    description: '',
    commentaries_open: false,
    tags: new FormControl<TagDTO[]>([]),
    slug: ''
  });
  protected readonly TinyMCEConfig = TinyMceConfig;
  private paramListener!: Subscription;
  private postSlug = '';

  constructor(
    private route: ActivatedRoute,
    private postsService: PostsService,
    private message: MessageService,
    private router: Router,
    private fb: FormBuilder,
    private imagesService: ImagesService,
    private metaService: MetaService,
    private tagsService: TagsService,
    localStorage: CoolLocalStorage,
    themeService: ThemeService
  ) {
    localStorage.setItem(Options.STORAGE_ADMIN_MARK, '1');
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
            this.postForm.setValue({
              title: post.title,
              image: post.image,
              content: post.content,
              description: post.description,
              commentaries_open: post.commentaries_open,
              tags: post.tags,
              slug: post.slug
            });
            this.initMeta();
          }
        });
    });
  }

  send() {
    if (this.postSlug)
      this.postsService.updatePostById(this.post.id, this.postForm.value).subscribe((_) => {
        this.message.success('Post updated.');
      });
    else
      this.postsService.createPost(this.postForm.value).subscribe((_) => {
        this.handleTags(this.postForm.value.slug!);
        this.postForm.reset();
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

  backToPost() {
    this.router.navigate(['/' + this.post.slug]);
  }

  handleTags(postSlug: string) {
    this.postForm.value.tags?.forEach(t => {
      this.tagsService.link(postSlug, t.slug).subscribe();
    });
  }

  addTag(i: TagDTO) {
    if (this.postSlug) return;
    const newTags: TagDTO[] = this.postForm.get('tags')?.value || [];
    newTags.push(i);
    this.postForm.patchValue({ tags: newTags });
  }

  removeTag(i: TagDTO) {
    if (this.postSlug) return;
    const oldTags: TagDTO[] = this.postForm.get('tags')?.value || [];
    this.postForm.patchValue({ tags: oldTags.filter(e => e.slug !== i.slug) });
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
