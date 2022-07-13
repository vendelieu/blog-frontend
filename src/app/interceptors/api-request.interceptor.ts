import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Inject, Injectable, Optional } from '@angular/core';
import { REQUEST } from '@nguniversal/express-engine/tokens';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { PlatformService } from '../core/platform.service';
import { Options } from '../config/site-options';

@Injectable()
export class ApiRequestInterceptor implements HttpInterceptor {
  constructor(
    private platform: PlatformService,
    @Optional() @Inject(REQUEST) private request: Request
  ) {
  }

  intercept(httpRequest: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const isApiRequest = httpRequest.url.startsWith(Options.api_url + '/api');
    if (isApiRequest) {
      if (this.request && this.request.headers.cookie) {
        httpRequest = httpRequest.clone({
          setHeaders: {
            Cookie: this.request.headers.cookie
          }
        });
      }
    }
    return next.handle(httpRequest);
  }
}
