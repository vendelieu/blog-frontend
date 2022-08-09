import { DOCUMENT } from '@angular/common';
import { Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ResponseCode } from '../../config/response-code.enum';
import { OptionEntity } from '../../interfaces/options';
import { UserModel } from '../../interfaces/users';
import { AuthService } from '../../services/auth.service';
import { UsersService } from '../../services/users.service';
import { Options } from '../../config/site-options';
import { faMoon, faSearch, faSun } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.less']
})
export class HeaderComponent implements OnInit, OnDestroy {
  @Input() searchOpen = false;
  @Output() searchOpenChange = new EventEmitter<boolean>();

  options: OptionEntity = Options;
  showSearch = false;
  keyword = '';
  focusSearch = false;
  user!: UserModel;
  isLoggedIn = false;
  searchIcon = faSearch;
  currentTheme: string | undefined = undefined;
  lightThemeIcon = faSun;
  darkThemeIcon = faMoon;

  private commonListener!: Subscription;
  private userListener!: Subscription;
  private logoutListener!: Subscription;

  constructor(
    private usersService: UsersService,
    private authService: AuthService,
    private router: Router,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.currentTheme = this.document.getElementsByTagName('html').item(0)?.getAttribute('color-mode') ?? undefined;
  }

  ngOnInit(): void {
    this.userListener = this.usersService.loginUser$.subscribe((user) => {
      this.user = user;
      this.isLoggedIn = this.usersService.isLoggedIn;
    });
  }

  ngOnDestroy(): void {
    this.commonListener.unsubscribe();
    this.userListener.unsubscribe();
    this.logoutListener?.unsubscribe();
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
    this.document.getElementsByTagName('html').item(0)?.setAttribute('color-mode', newTheme);
    this.currentTheme = newTheme;
  }

  logout() {
    this.hideMenu();
    this.logoutListener = this.authService.logout().subscribe((res) => {
      if (res.code === ResponseCode.SUCCESS) {
        location.reload();
      }
    });
  }
}
