import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { PostsService } from '../../services/posts.service';
import { CommonModule, DOCUMENT } from '@angular/common';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-modal',
  templateUrl: './search-modal.component.html',
  styleUrls: ['./search-modal.component.less'],
  imports: [CommonModule, FontAwesomeModule, FormsModule],
  standalone: true
})
export class SearchModalComponent {
  keyword = '';
  searchIcon = faSearch;

  constructor(
    private postsService: PostsService,
    private router: Router,
    @Inject(DOCUMENT) private document: Document
  ) {
  }

  search() {
    this.keyword = this.keyword.trim();
    if (this.keyword) {
      this.router.navigate(['/search/' + this.keyword]).then(() => {
        this.hideModal();
      });
    }
  }

  onClick(e: Event) {
    if (!(e.target as HTMLInputElement).type) {
      this.hideModal();
      this.keyword = '';
    }
  }

  private hideModal() {
    this.document.body.getElementsByClassName('search')?.item(0)?.classList.add('hide-search');
    this.document.body.style.overflow = '';
    this.keyword = '';
  }
}
