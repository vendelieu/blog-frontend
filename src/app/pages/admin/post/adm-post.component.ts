import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PostsService } from '../../../services/posts.service';
import { PostEntity, PostEntity_DefaultInst } from '../../../interfaces/posts';
import { TagDTO } from '../../../interfaces/tag';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { TinyMceConfig } from '../../../config/tiny-mce-config';
import { ThemeService } from '../../../services/theme.service';
import { HTMLMetaData } from '../../../interfaces/meta';
import { Options } from '../../../config/site-options';
import { MetaService } from '../../../services/meta.service';
import { ImagesService } from '../../../services/images.service';
import { slugify } from '../../../helpers/slugify';
import { faUndo } from '@fortawesome/free-solid-svg-icons';
import { TagsService } from '../../../services/tags.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { EditorModule } from '@tinymce/tinymce-angular';
import { TagInputComponent } from '../../../components/tag-input/tag-input.component';
import { CommonModule } from '@angular/common';
import { PlatformService } from '../../../services/platform.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-post',
  templateUrl: './adm-post.component.html',
  styleUrls: ['./adm-post.component.less'],
  standalone: true,
  imports: [
    CommonModule,
    TagInputComponent,
    FontAwesomeModule,
    ReactiveFormsModule,
    EditorModule
  ]
})
export class AdmPostComponent implements OnInit {
  @Input() slug = '';

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

  constructor(
    private postsService: PostsService,
    private toastr: ToastrService,
    private router: Router,
    private fb: FormBuilder,
    private imagesService: ImagesService,
    private metaService: MetaService,
    private tagsService: TagsService,
    platform: PlatformService,
    themeService: ThemeService
  ) {
    if (platform.isBrowser) {
      localStorage.setItem(Options.STORAGE_ADMIN_MARK, '1');
    }
    themeService.themeChanges.subscribe((e) => {
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
    if (!this.slug) return;
    this.postsService.getPostBySlug(this.slug).subscribe((post) => {
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
  }

  send() {
    if (this.slug)
      this.postsService.updatePostById(this.post.id, this.postForm.value).subscribe((_) => {
        this.toastr.success('Post updated');
      });
    else
      this.postsService.createPost(this.postForm.value).subscribe((_) => {
        this.handleTags(this.postForm.value.slug!);
        this.postForm.reset();
        this.toastr.success('Post created.');
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
      this.toastr.success('Post deleted.');
      this.router.navigate(['/']);
    });
  }

  onImageChange() {
    const imageUrl = this.postForm.get('image')?.value;
    if (!imageUrl) return;
    this.imagesService.saveImage(imageUrl).subscribe((img) => {
      this.postForm.patchValue({ image: img.url });
    });
  }

  backToPost() {
    this.router.navigate(['/' + (this.slug ? 'post/' + this.slug : '')]);
  }

  handleTags(postSlug: string) {
    this.postForm.value.tags?.forEach(t => {
      this.tagsService.link(postSlug, t.slug).subscribe();
    });
  }

  addTag(i: TagDTO) {
    if (this.slug) return;
    const newTags: TagDTO[] = this.postForm.get('tags')?.value || [];
    newTags.push(i);
    this.postForm.patchValue({ tags: newTags });
  }

  removeTag(i: TagDTO) {
    if (this.slug) return;
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
