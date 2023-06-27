import { Inject, Injectable, makeStateKey, Optional, StateKey } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
  HttpResponse,
  HttpStatusCode
} from '@angular/common/http';
import { TransferState } from '@angular/platform-browser';
import { EMPTY, from, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { PlatformService } from '../core/platform.service';
import { ApiUrl } from '../config/api-url';
import { Options } from '../config/site-options';
import { Message } from '../config/message.enum';
import { MessageService } from '../components/message/message.service';
import { Router } from '@angular/router';
import { RESPONSE } from '@nestjs/ng-universal/dist/tokens';
import { Response } from 'express';

@Injectable({ providedIn: 'root' })
export class TransferHttpService {
  private apiUrlPrefix: string = ApiUrl.API_URL_PREFIX;

  getApiUrl(path: string): string {
    return `${Options.api_url}${this.apiUrlPrefix}${path}`;
  }

  constructor(
    protected transferState: TransferState,
    private httpClient: HttpClient,
    private platform: PlatformService,
    private message: MessageService,
    private router: Router,
    @Optional() @Inject(RESPONSE) private response: Response
  ) {}

  checkAccess(url: string): Observable<boolean> {
    return this.httpClient.get(url, { observe: 'response' }).pipe(
      map((response: HttpResponse<any>) => response.status !== 403),
      catchError(() => of(false))
    );
  }

  request<T>(
    method: string,
    uri: string | Request,
    options?: {
      body?: any;
      params?: HttpParams | Record<string, any> | string[] | string;
      headers?:
        | HttpHeaders
        | {
            [header: string]: string | string[];
          };
      reportProgress?: boolean;
      observe?: 'response';
      responseType?: 'json';
      withCredentials?: boolean;
    }
  ): Observable<T> {
    return this.getData<T>(method, uri, options, (method: string, url: string, options: any) => {
      return this.httpClient
        .request<T>(method, url, options)
        .pipe(catchError(this.handleError<T>()));
    });
  }

  /**
   * Performs a request with `get` http method.
   */
  get<T>(
    url: string,
    options?: {
      params?: HttpParams | Record<string, any> | string[] | string;
      headers?:
        | HttpHeaders
        | {
            [header: string]: string | string[];
          };
      observe?: 'response';
      reportProgress?: boolean;
      responseType?: 'json';
      withCredentials?: boolean;
    }
  ): Observable<T> {
    return this.getData<T>('get', url, options, (_method: string, url: string, options: any) => {
      return this.httpClient.get<T>(url, options).pipe(catchError(this.handleError<T>()));
    });
  }

  /**
   * Performs a request with `post` http method.
   */
  post<T>(
    url: string,
    body: any,
    options?: {
      params?: HttpParams | Record<string, any> | string[] | string;
      headers?:
        | HttpHeaders
        | {
            [header: string]: string | string[];
          };
      observe?: 'response';
      reportProgress?: boolean;
      responseType?: 'json';
      withCredentials?: boolean;
    }
  ): Observable<T> {
    return this.getPostData<T>(
      'post',
      url,
      body,
      options,
      (_method: string, url: string, body: any, options: any) => {
        return this.httpClient.post<T>(url, body, options).pipe(catchError(this.handleError<T>()));
      }
    );
  }

  /**
   * Performs a request with `put` http method.
   */
  put<T>(
    url: string,
    _body: any,
    options?: {
      params?: HttpParams | Record<string, any> | string[] | string;
      headers?:
        | HttpHeaders
        | {
            [header: string]: string | string[];
          };
      observe?: 'body';
      reportProgress?: boolean;
      responseType?: 'json';
      withCredentials?: boolean;
    }
  ): Observable<T> {
    return this.getPostData<T>(
      'put',
      url,
      _body,
      options,
      (_method: string, url: string, _body: any, options: any) => {
        return this.httpClient.put<T>(url, _body, options).pipe(catchError(this.handleError<T>()));
      }
    );
  }

  /**
   * Performs a request with `delete` http method.
   */
  delete<T>(
    url: string,
    options?: {
      params?: HttpParams | Record<string, any> | string[] | string;
      headers?:
        | HttpHeaders
        | {
            [header: string]: string | string[];
          };
      observe?: 'response';
      reportProgress?: boolean;
      responseType?: 'json';
      withCredentials?: boolean;
    }
  ): Observable<T> {
    return this.getData<T>('delete', url, options, (_method: string, url: string, options: any) => {
      return this.httpClient.delete<T>(url, options).pipe(catchError(this.handleError<T>()));
    });
  }

  /**
   * Performs a request with `patch` http method.
   */
  patch<T>(
    url: string,
    body: any,
    options?: {
      params?: HttpParams | Record<string, any> | string[] | string;
      headers?:
        | HttpHeaders
        | {
            [header: string]: string | string[];
          };
      observe?: 'response';
      reportProgress?: boolean;
      responseType?: 'json';
      withCredentials?: boolean;
    }
  ): Observable<T> {
    return this.getPostData<T>(
      'patch',
      url,
      body,
      options,
      (_method: string, url: string, body: any, options: any): Observable<any> => {
        return this.httpClient.patch<T>(url, body, options).pipe(catchError(this.handleError<T>()));
      }
    );
  }

  /**
   * Performs a request with `head` http method.
   */
  head<T>(
    url: string,
    options?: {
      params?: HttpParams | Record<string, any> | string[] | string;
      headers?:
        | HttpHeaders
        | {
            [header: string]: string | string[];
          };
      observe?: 'response';
      reportProgress?: boolean;
      responseType?: 'json';
      withCredentials?: boolean;
    }
  ): Observable<T> {
    return this.getData<T>('head', url, options, (_method: string, url: string, options: any) => {
      return this.httpClient.head<T>(url, options).pipe(catchError(this.handleError<T>()));
    });
  }

  /**
   * Performs a request with `options` http method.
   */
  options<T>(
    url: string,
    options?: {
      params?: HttpParams | Record<string, any> | string[] | string;
      headers?:
        | HttpHeaders
        | {
            [header: string]: string | string[];
          };
      observe?: 'response';
      reportProgress?: boolean;
      responseType?: 'json';
      withCredentials?: boolean;
    }
  ): Observable<T> {
    return this.getData<T>(
      'options',
      url,
      options,
      (_method: string, url: string, options: any) => {
        return this.httpClient.options<T>(url, options).pipe(catchError(this.handleError<T>()));
      }
    );
  }

  private getData<T>(
    method: string,
    uri: string | Request,
    options: any,
    callback: (method: string, uri: any, options: any) => Observable<any>
  ): Observable<T> {
    let url = uri;
    if (typeof uri !== 'string') {
      url = uri.url;
    }
    const tempKey = url + (options ? JSON.stringify(options) : '');
    const key = makeStateKey<T>(tempKey);
    try {
      return this.resolveData<T>(key);
    } catch (e) {
      //console.log('in catch', key);
      return callback(method, uri, options).pipe(
        tap((data: T) => {
          if (this.platform.isBrowser) {
            // Client only code.
            // nothing;
          }
          if (this.platform.isServer) {
            //console.log('set cache', key);
            this.setCache<T>(key, data);
          }
        })
      );
    }
  }

  private getPostData<T>(
    _method: string,
    uri: string | Request,
    body: any,
    options: any,
    callback: (method: string, uri: any, body: any, options: any) => Observable<any>
  ): Observable<T> {
    let url = uri;

    if (typeof uri !== 'string') {
      url = uri.url;
    }

    const tempKey =
      url + (body ? JSON.stringify(body) : '') + (options ? JSON.stringify(options) : '');
    const key = makeStateKey<T>(tempKey);

    try {
      return this.resolveData<T>(key);
    } catch (e) {
      return callback(_method, uri, body, options).pipe(
        tap((data: T) => {
          if (this.platform.isBrowser) {
            // Client only code.
            // nothing;
          }
          if (this.platform.isServer) {
            this.setCache<T>(key, data);
          }
        })
      );
    }
  }

  private resolveData<T>(key: StateKey<T>): Observable<T> {
    const data = this.getFromCache<T>(key);

    if (!data) {
      throw new Error();
    }

    if (this.platform.isBrowser) {
      //console.log('get cache', key);
      // Client only code.
      this.transferState.remove(key);
    }
    if (this.platform.isServer) {
      //console.log('we are the server');
      // Server only code.
    }

    return from(Promise.resolve<T>(data));
  }

  private setCache<T>(key: StateKey<T>, data: T): void {
    return this.transferState.set<T>(key, data);
  }

  private getFromCache<T>(key: StateKey<T | null>): T | null {
    return this.transferState.get<T | null>(key, null);
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
