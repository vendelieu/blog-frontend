import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ResponseCode } from '../../config/response-code.enum';
import { CommonService } from '../../core/common.service';
import { UserAgentService } from '../../core/user-agent.service';
import { OptionEntity } from '../../interfaces/options';
import { UserModel } from '../../interfaces/users';
import { AuthService } from '../../services/auth.service';
import { UsersService } from '../../services/users.service';
import { Options } from '../../config/site-options';

@Component({
  selector: 'app-sider-mobile',
  templateUrl: './sider-mobile.component.html',
  styleUrls: ['./sider-mobile.component.less']
})
export class SiderMobileComponent implements OnInit, OnDestroy {
  @Input() siderOpen = false;

  isMobile = false;
  activePage = '';
  options: OptionEntity = Options;
  user!: UserModel;
  isLoggedIn = false;

  private commonListener!: Subscription;
  private userListener!: Subscription;
  private logoutListener!: Subscription;

  constructor(
    private commonService: CommonService,
    private userAgentService: UserAgentService,
    private usersService: UsersService,
    private authService: AuthService
  ) {
    this.isMobile = this.userAgentService.isMobile();
  }

  ngOnInit(): void {
    this.commonListener = this.commonService.pageIndex$.subscribe((pageIndex) => this.activePage = pageIndex);
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

  logout() {
    this.logoutListener = this.authService.logout().subscribe((res) => {
      if (res.code === ResponseCode.SUCCESS) {
        location.reload();
      }
    });
  }
}
