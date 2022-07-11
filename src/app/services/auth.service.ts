import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ApiUrl } from '../config/api-url';
import { ResponseCode } from '../config/response-code.enum';
import { ApiService } from '../core/api.service';
import { PlatformService } from '../core/platform.service';
import { LoginEntity, RegisterEntity } from '../interfaces/auth';
import { HttpResponseEntity } from '../interfaces/http-response';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private apiService: ApiService,
    private platform: PlatformService,
    private readonly cookieService: CookieService
  ) {
  }

  register(registerData: RegisterEntity): Observable<HttpResponseEntity<string> | undefined> {
    return this.apiService.httpPost<string>(this.apiService.getApiUrl(ApiUrl.REGISTER), registerData);
  }

  login(loginData: LoginEntity): Observable<HttpResponseEntity<string> | undefined> {
    return this.apiService.httpPost<string>(this.apiService.getApiUrl(ApiUrl.LOGIN), loginData);
  }

  logout(): Observable<HttpResponseEntity<any>> {
    this.clearAuth();
    return this.apiService.httpPost<HttpResponseEntity<any>>(this.apiService.getApiUrl(ApiUrl.LOGOUT)).pipe(
      tap((res) => {
        if (res.code === ResponseCode.SUCCESS) {
          this.clearAuth();
        }
      })
    );
  }

  clearAuth() {
    this.cookieService.delete('auth');
  }
}
