import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ApiUrl } from '../config/api-url';
import { ApiService } from '../core/api.service';
import { UserModel } from '../interfaces/users';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  isLoggedIn = false;
  private loginUser: BehaviorSubject<UserModel> = new BehaviorSubject<UserModel>({
    created_at: Date.prototype,
    email: '',
    is_admin: false,
    id: 0, username: ''
  });
  loginUser$: Observable<UserModel> = this.loginUser.asObservable();

  constructor(
    private apiService: ApiService
  ) {
  }

  getLoginUser(): Observable<UserModel | undefined> {
    if (this.isLoggedIn) {
      return this.loginUser$;
    }
    return this.apiService.httpGet<UserModel>(this.apiService.getApiUrl(ApiUrl.GET_LOGIN_USER)).pipe(
      map((res) => res?.data || undefined),
      tap((user) => {
        this.isLoggedIn = !!user?.id;
        if (user) {
          this.loginUser.next(user);
        }
      })
    );
  }
}
