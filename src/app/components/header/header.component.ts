import {DOCUMENT} from '@angular/common';
import {Component, EventEmitter, Inject, Input, OnDestroy, Output} from '@angular/core';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {OptionEntity} from '../../interfaces/options';
import {Options} from '../../config/site-options';
import {faMoon, faSearch, faSun} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent implements OnDestroy {
  @Input() searchOpen = false;
  @Output() searchOpenChange = new EventEmitter<boolean>();

  options: OptionEntity = Options;
  showSearch = false;
  keyword = '';
  searchIcon = faSearch;
  currentTheme: string | undefined = undefined;
  isBlack = true
  lightThemeIcon = faSun;
  darkThemeIcon = faMoon;

  private commonListener!: Subscription;

  constructor(
    private router: Router,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.currentTheme = this.document.getElementsByTagName('html').item(0)?.getAttribute('color-mode') ?? undefined;
  }

  ngOnDestroy(): void {
    this.commonListener.unsubscribe();
  }

  search() {
    this.keyword = this.keyword.trim();
    if (this.keyword) {
      this.showSearch = false;
      this.router.navigate(['/'], {queryParams: {keyword: this.keyword}});
    }
  }

  toggleOverflow() {
    if (this.document.body.style.overflow === 'hidden') this.document.body.style.overflow = '';
    else this.document.body.style.overflow = 'hidden';
  }

  hideMenu() {
    if (this.document.body.style.overflow === 'hidden') this.document.getElementById('ham')?.click();
  }

  toggleSearchOpen() {
    this.searchOpen = !this.searchOpen;
    this.searchOpenChange.emit(this.searchOpen);
    this.document.body.style.overflow = 'hidden';
    this.document.body.getElementsByClassName('search')?.item(0)?.classList.remove('hide-search');
  }

  toggleTheme() {
    const newTheme = this.currentTheme == 'dark' ? 'light' : 'dark';
    this.isBlack = newTheme != "light";
    this.document.getElementsByTagName('html').item(0)?.setAttribute('color-mode', newTheme);
    this.currentTheme = newTheme;
  }
}
