import {Component, OnDestroy, OnInit} from '@angular/core';
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import {Observable, Subscription} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {PostsService} from "../../services/posts.service";
import {PostEntity} from "../../interfaces/posts";
import {TagsService} from "../../services/tags.service";
import {NewTag, Tag, UpdatableTag} from "../../interfaces/tag";
import {TagModel} from "ngx-chips/core/tag-model";
import {FormBuilder} from "@angular/forms";
import {MessageService} from "../../components/message/message.service";

@Component({
  selector: 'app-admin-post',
  templateUrl: './admin-post.component.html',
  styleUrls: ['./admin-post.component.less']
})
export class AdminPostComponent implements OnInit, OnDestroy {
  public Editor = ClassicEditor;
  private paramListener!: Subscription;
  private postSlug = ''
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
  private tags: string[] = []
  private newTags: NewTag[] = []
  private addTags: string[] = []
  private removeTags: string[] = []
  postForm = this.fb.group({
    title: [''],
    image: [''],
    content: [''],
    description: [''],
    commentaries_open: false,
    slug: ['']
  })

  constructor(
    private route: ActivatedRoute,
    private postsService: PostsService,
    private tagService: TagsService,
    private message: MessageService,
    private router: Router,
    private fb: FormBuilder
  ) {
  }

  ngOnInit(): void {
    this.paramListener = this.route.params.subscribe((params) => {
      this.postSlug = params['postSlug']?.trim();
      if (this.postSlug) this.postsService.getPostBySlug(this.postSlug).subscribe((post) => {
        if (post) {
          this.post = post
          this.tags = post.tags?.map((tag) => tag.slug) || [];
          this.postForm.setValue({
            title: post.title,
            image: post.image,
            content: post.content,
            description: post.description,
            commentaries_open: post.commentaries_open,
            slug: post.slug
          })
        }
      });
    });
  }

  requestAutocompleteItems = (text: string): Observable<Tag[] | undefined> => {
    return this.tagService.getByName(text)
  };

  onTagAdd($event: TagModel): void {
    let tag = $event as UpdatableTag;
    if (tag.value != null) {
      this.newTags.push({
        name: tag.name,
        slug: this.slugify(tag.value),
      });
    } else {
      this.addTags.push(tag.slug);
      this.removeTags = this.removeTags.filter(t => t !== tag.slug)
    }
  }

  onTagRemove($event: TagModel): void {
    let tag = $event as UpdatableTag;
    if (tag.slug) this.removeTags.push(tag.slug)
    else this.newTags = this.newTags.filter(t => t.name !== tag.value);
  }

  handleTags(postSlug: string) {
    new Set(this.newTags).forEach((i) => {
      this.tagService.create(i).subscribe();
      this.tagService.link(postSlug, i.slug).subscribe();
    });
    new Set(this.addTags).forEach((t) => {
      if (this.tags.includes(t)) return
      this.tagService.link(postSlug, t).subscribe();
    });
    new Set(this.removeTags).forEach((t) => {
      this.tagService.unlink(postSlug, t).subscribe();
    });
  }

  send() {
    if (this.postSlug) this.postsService.updatePostById(this.post.id, this.postForm.value)
      .subscribe((_) => {
        this.handleTags(this.postSlug);
        this.message.success("Post updated.");
      });
    else this.postsService.createPost(this.postForm.value).subscribe((_) => {
      this.postForm.reset();
      this.handleTags(this.postForm.value.slug!);
      this.message.success("Post created.");
    })
  }

  onSlugChange() {
    let oldSlug = this.postForm.get("slug")?.value?.trim()
    if (!oldSlug) return
    let newSlug = this.slugify(oldSlug)
    this.postForm.get("slug")?.setValue(newSlug)
  }

  private slugify(text: string) {
    return text
      .normalize('NFKD')            // normalize() using NFKD method returns the Unicode Normalization Form of a given string.
      .toLowerCase()                // Convert the string to lowercase letters
      .trim()                       // Remove whitespace from both sides of a string (optional)
      .replace(/\s+/g, '-')         // Replace spaces with -
      .replace(/[^\w\-]+/g, '')     // Remove all non-word chars
      .replace(/_/g, '-')           // Replace _ with -
      .replace(/--+/g, '-')       // Replace multiple - with single -
      .replace(/-$/g, '');         // Remove trailing -
  }

  delete() {
    this.postsService.deletePost(this.post.id).subscribe((res) => {
      this.message.success("Post deleted.");
      this.router.navigate(['/'])
    })
  }

  ngOnDestroy() {
    this.paramListener.unsubscribe();
  }
}
