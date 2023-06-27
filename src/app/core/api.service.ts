import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
  HttpResponse,
  HttpStatusCode
} from '@angular/common/http';
import { Inject, Injectable, makeStateKey, Optional, StateKey, TransferState } from '@angular/core';
import { Router } from '@angular/router';
import { Response } from 'express';
import { EMPTY, from, Observable, of, tap } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { MessageService } from '../components/message/message.service';
import { ApiUrl } from '../config/api-url';
import { HttpResponseEntity } from '../interfaces/http-response';
import { PlatformService } from './platform.service';
import { Options } from '../config/site-options';
import { RESPONSE } from '@nestjs/ng-universal/dist/tokens';
import { Message } from '../config/message.enum';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrlPrefix: string = ApiUrl.API_URL_PREFIX;

  constructor(
    private http: HttpClient,
    private message: MessageService,
    private router: Router,
    private platform: PlatformService,
    private _state: TransferState,
    @Optional() @Inject(RESPONSE) private response: Response
  ) {}

  getApiUrl(path: string): string {
    return `${Options.api_url}${this.apiUrlPrefix}${path}`;
  }

  checkAccess(url: string): Observable<boolean> {
    return this.http.get(url, { observe: 'response' }).pipe(
      map((response: HttpResponse<any>) => response.status !== 403),
      catchError(() => of(false))
    );
  }

  httpGet<T>(
    url: string,
    param: Record<string, any> = {},
    key?: string
  ): Observable<HttpResponseEntity<T>> {
    return this.getData(
      url,
      param,
      () =>
        this.http
          .get<HttpResponseEntity<T>>(url, {
            params: new HttpParams({
              fromObject: param
            }),
            observe: 'body'
          })
          .pipe(catchError(this.handleError<T>())),
      key
    );
  }

  httpGetCustomResponse<T>(
    url: string,
    param: Record<string, any> = {},
    key?: string
  ): Observable<T> {
    return this.getData(
      url,
      param,
      () =>
        this.http
          .get<HttpResponseEntity<T>>(url, {
            params: new HttpParams({
              fromObject: param
            }),
            observe: 'body'
          })
          .pipe(catchError(this.handleError<T>())),
      key
    );
  }

  httpPost<T>(
    url: string,
    body: Record<string, any> | FormData = {}
  ): Observable<HttpResponseEntity<T>> {
    return this.getData(url, body, () =>
      this.http
        .post<HttpResponseEntity<T>>(url, body, {
          observe: 'body'
        })
        .pipe(catchError(this.handleError<HttpResponseEntity<T>>()))
    );
  }

  httpDelete<T>(url: string): Observable<HttpResponseEntity<T>> {
    return this.getData(url, {}, () =>
      this.http
        .delete<HttpResponseEntity<T>>(url, {
          observe: 'body'
        })
        .pipe(catchError(this.handleError<HttpResponseEntity<T>>()))
    );
  }

  httpPut<T>(
    url: string,
    body: Record<string, any> | FormData = {}
  ): Observable<HttpResponseEntity<T>> {
    return this.getData(url, body, () =>
      this.http
        .put<HttpResponseEntity<T>>(url, body, {
          observe: 'body'
        })
        .pipe(catchError(this.handleError<HttpResponseEntity<T>>()))
    );
  }

  private getData(
    url: string,
    options: Record<string, any> = {},
    callback: () => Observable<any>,
    _key?: string
  ): Observable<any> {
    const optionsString = options ? JSON.stringify(options) : '';
    let key = makeStateKey<string>(_key ?? `${url + optionsString}`);
    try {
      return this.resolveData(key);
    } catch (e) {
      return callback().pipe(
        tap((data) => {
          this.setCache(key, data);
        })
      );
    }
  }

  private resolveData(key: StateKey<string>) {
    let resultData: any;
    if (this.hasKey(key)) {
      resultData = this.getFromCache(key);
    } else {
      throw new Error();
    }
    return from(Promise.resolve(resultData));
  }

  setCache(key: StateKey<string>, value: any) {
    this._state.set(key, value);
  }

  private getFromCache(key: StateKey<string>) {
    return this._state.get(key, null); // null set as default value
  }

  private hasKey(key: StateKey<string>) {
    return this._state.hasKey(key);
  }

  private handleError<T>() {
    return (error: HttpErrorResponse): Observable<T> => {
      if (error.status !== HttpStatusCode.NotFound) {
        this.message.error(error.error?.message || error.message || Message.UNKNOWN_ERROR);
        // Let the app keep running by returning an empty result.
        return of(error.error as T);
      }
      if (this.platform.isBrowser) {
        this.router.navigate(['/']);
      } else {
        this.response.redirect('/');
      }
      return EMPTY;
    };
  }
}
