import { DOCUMENT } from '@angular/common';
import { afterNextRender, Component, EventEmitter, Inject, Input, OnDestroy, Output } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { OptionEntity } from '../../interfaces/options';
import { Options } from '../../config/site-options';
import { faMoon, faSearch, faSun } from '@fortawesome/free-solid-svg-icons';
import { ThemeService } from '../../services/theme.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Subscription } from 'rxjs';
import { PlatformService } from '../../services/platform.service';

type Theme = 'light' | 'dark';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less'],
  imports: [FontAwesomeModule, RouterLink],
  standalone: true
})
export class HeaderComponent {
  @Input() searchOpen = false;
  @Output() searchOpenChange = new EventEmitter<boolean>();

  options: OptionEntity = Options;
  showSearch = false;
  keyword = '';
  searchIcon = faSearch;
  currentTheme: string | undefined = undefined;
  isDark = true;
  lightThemeIcon = faSun;
  darkThemeIcon = faMoon;

  constructor(
    private router: Router,
    private themeService: ThemeService,
    private platformService: PlatformService,
    @Inject(DOCUMENT) private document: Document
  ) {
    if (platformService.isBrowser) {
      let theme = localStorage.getItem(Options.STORAGE_THEME_KEY);
      if (!theme) {
        theme = this.document.getElementsByTagName('html').item(0)?.getAttribute('color-mode') ?? 'dark';
      }
      this.themeService.changeTheme(theme);
      this.themeService.themeChanges.subscribe((t) => {
        this.setTheme(<'light' | 'dark'>t);
      });
    }
  }

  search() {
    this.keyword = this.keyword.trim();
    if (this.keyword) {
      this.showSearch = false;
      this.router.navigate(['/'], { queryParams: { keyword: this.keyword } });
    }
  }

  toggleOverflow() {
    if (this.document.body.style.overflow === 'hidden') this.document.body.style.overflow = '';
    else this.document.body.style.overflow = 'hidden';
  }

  hideMenu() {
    if (this.document.body.style.overflow === 'hidden')
      this.document.getElementById('ham')?.click();
  }

  toggleSearchOpen() {
    this.searchOpen = !this.searchOpen;
    this.searchOpenChange.emit(this.searchOpen);
    this.document.body.style.overflow = 'hidden';
    this.document.body.getElementsByClassName('search')?.item(0)?.classList.remove('hide-search');
  }

  toggleTheme() {
    const newTheme: Theme = this.currentTheme == 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
  }

  private setTheme(theme: Theme) {
    this.document.getElementsByTagName('html').item(0)?.setAttribute('color-mode', theme);
    this.currentTheme = theme;
    this.isDark = theme != 'light';
    if (this.platformService.isBrowser) {
      localStorage.setItem(Options.STORAGE_THEME_KEY, theme);
    }
  }
}
