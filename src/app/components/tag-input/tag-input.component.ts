import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { TagDTO } from '../../interfaces/tag';
import { slugify } from '../../helpers/slugify';
import { Observable } from 'rxjs';
import { TagsService } from '../../services/tags.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tag-input',
  template: `
    <div class='tag-input-container'>
      <div class='tags'>
        <span *ngFor='let tag of tags; let i = index' class='tag'>
          {{ tag.name }}
          <span class='remove-tag' (click)='removeTag(i)'>×</span>
        </span>
      </div>
      <input
        [(ngModel)]='inputValue'
        (keydown.enter)='addTag()'
        (input)='onInputChange()'
        (focus)='showDropdown()'
        (blur)='hideDropdown()'
        [placeholder]='placeholder'
        class='tag-input' />
      <div class='autocomplete-list' *ngIf='showAutocomplete && autocompleteItems && autocompleteItems.length > 0'>
        <div
          *ngFor='let item of autocompleteItems'
          class='autocomplete-item'
          (mousedown)='selectAutocompleteItem(item);'>
          {{ item.name }}
        </div>
      </div>
    </div>
  `,
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrls: ['./tag-input.component.less']
})
export class TagInputComponent {
  @Input() postSlug: string = '';
  @Input() tags: TagDTO[] = [];
  @Input() placeholder: string = 'Add a tag';
  @Output() onAdd = new EventEmitter<TagDTO>();
  @Output() onRemove = new EventEmitter<TagDTO>();

  inputValue: string = '';
  autocompleteItems: TagDTO[] = [];
  showAutocomplete: boolean = true;

  constructor(private tagService: TagsService) {
    this.onAdd.subscribe(t => {
      this.link(t);
    });
    this.onRemove.subscribe(t => {
      this.unlink(t);
    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!(event.target as HTMLElement).closest('.tag-input-container')) {
      this.clearInput();
      this.hideDropdown();
    }
  }

  addTag() {
    const input = this.inputValue.trim();
    if (input) {
      const newTag = { name: input, slug: slugify(input) } as TagDTO;
      this.clearInput();
      if (this.tags.some(e => e.slug === newTag.slug)) return;
      this.tags.push(newTag);
      this.onAdd.emit(newTag);
    }
  }

  removeTag(index: number) {
    const tag = this.tags[index];
    this.onRemove.emit(tag);
    this.tags.splice(index, 1);
  }

  onInputChange() {
    if (this.inputValue.length > 0) {
      this.showDropdown();
      this.requestAutocompleteItems(this.inputValue)
        .subscribe(items => {
          this.autocompleteItems = items || [];
        });
    }
  }

  selectAutocompleteItem(item: TagDTO) {
    if (this.tags.some(e => e.slug === item.slug)) return;
    this.tags.push(item);
    this.onAdd.emit(item);
    this.clearInput();
  }

  requestAutocompleteItems(text: string): Observable<TagDTO[] | undefined> {
    return this.tagService.getByName(text);
  }

  showDropdown() {
    this.showAutocomplete = true;
  }

  hideDropdown() {
    this.showAutocomplete = false;
  }

  private createTag(tag: TagDTO) {
    if (tag.id) return;
    this.tagService.create(tag).subscribe();
  }

  private link(tag: TagDTO) {
    if (!tag.id) this.createTag(tag);
    if (this.postSlug.length == 0) return;
    this.tagService.link(this.postSlug, tag.slug).subscribe();
  }

  private unlink(tag: TagDTO) {
    this.tagService.unlink(this.postSlug, tag.slug).subscribe();
  }

  private clearInput() {
    this.inputValue = '';
    this.autocompleteItems = [];
  }
}
