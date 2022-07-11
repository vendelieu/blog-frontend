import { HttpClient, HttpErrorResponse, HttpParams, HttpStatusCode } from '@angular/common/http';
import { Inject, Injectable, Optional } from '@angular/core';
import { Router } from '@angular/router';
import { RESPONSE } from '@nguniversal/express-engine/tokens';
import { Response } from 'express';
import { EMPTY, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MessageService } from '../components/message/message.service';
import { ApiUrl } from '../config/api-url';
import { Message } from '../config/message.enum';
import { HttpResponseEntity } from '../interfaces/http-response';
import { PlatformService } from './platform.service';
import { Options } from '../config/site-options';

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
    @Optional() @Inject(RESPONSE) private response: Response
  ) {
  }

  getApiUrl(path: string): string {
    return `${Options.site_url}${this.apiUrlPrefix}${path}`;
  }

  httpGet<T>(url: string, param: Record<string, any> = {}): Observable<HttpResponseEntity<T>> {
    return this.http.get<HttpResponseEntity<T>>(url, {
      params: new HttpParams({
        fromObject: param
      }),
      observe: 'body',
      withCredentials: true
    }).pipe(
      catchError(this.handleError<T>())
    );
  }

  httpGetCustomResponse<T>(url: string, param: Record<string, any> = {}): Observable<T> {
    return this.http.get<T>(url, {
      params: new HttpParams({
        fromObject: param
      }),
      observe: 'body',
      withCredentials: true
    }).pipe(
      catchError(this.handleError<T>())
    );
  }

  httpPost<T>(url: string, body: Record<string, any> | FormData = {}): Observable<HttpResponseEntity<T>> {
    return this.http.post<T>(url, body, {
      observe: 'body',
      withCredentials: true
    }).pipe(
      catchError(this.handleError<T>())
    );
  }

  httpDelete<T>(url: string): Observable<HttpResponseEntity<T>> {
    return this.http.delete<T>(url, {
      observe: 'body',
      withCredentials: true
    }).pipe(
      catchError(this.handleError<T>())
    );
  }

  httpPut<T>(url: string, body: Record<string, any> | FormData = {}): Observable<HttpResponseEntity<T>> {
    return this.http.put<T>(url, body, {
      observe: 'body',
      withCredentials: true
    }).pipe(
      catchError(this.handleError<T>())
    );
  }

  private handleError<T>() {
    return (error: HttpErrorResponse): Observable<T> => {
      if (error.status !== HttpStatusCode.NotFound) {
        this.message.error(error.error?.message || error.message || Message.UNKNOWN_ERROR);
        // Let the app keep running by returning an empty result.
        return of(error.error as T);
      }
      if (this.platform.isBrowser) {
        this.router.navigate(['404']);
      } else {
        this.response.redirect('/404');
      }
      return EMPTY;
    };
  }
}
