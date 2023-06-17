import { HttpClient, HttpErrorResponse, HttpParams, HttpResponse, HttpStatusCode } from '@angular/common/http';
import { Inject, Injectable, Optional } from '@angular/core';
import { Router } from '@angular/router';
import { Response } from 'express';
import { EMPTY, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { MessageService } from '../components/message/message.service';
import { ApiUrl } from '../config/api-url';
import { Message } from '../config/message.enum';
import { HttpResponseEntity } from '../interfaces/http-response';
import { PlatformService } from './platform.service';
import { Options } from '../config/site-options';
import { RESPONSE } from '@nestjs/ng-universal/dist/tokens';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrlPrefix: string = ApiUrl.API_URL_PREFIX;

  constructor(private http: HttpClient, private message: MessageService, private router: Router, private platform: PlatformService, @Optional() @Inject(RESPONSE) private response: Response) {}

  getApiUrl(path: string): string {
    return `${Options.api_url}${this.apiUrlPrefix}${path}`;
  }

  checkAccess(url: string): Observable<boolean> {
    return this.http.get(url, { observe: 'response' }).pipe(
      map((response: HttpResponse<any>) => response.status !== 403),
      catchError(() => of(false))
    );
  }

  httpGet<T>(url: string, param: Record<string, any> = {}): Observable<HttpResponseEntity<T>> {
    return this.http
      .get<HttpResponseEntity<T>>(url, {
        params: new HttpParams({
          fromObject: param
        }),
        observe: 'body'
      })
      .pipe(catchError(this.handleError<HttpResponseEntity<T>>()));
  }

  httpGetCustomResponse<T>(url: string, param: Record<string, any> = {}): Observable<T> {
    return this.http
      .get<T>(url, {
        params: new HttpParams({
          fromObject: param
        }),
        observe: 'body'
      })
      .pipe(catchError(this.handleError<T>()));
  }

  httpPost<T>(url: string, body: Record<string, any> | FormData = {}): Observable<HttpResponseEntity<T>> {
    return this.http
      .post<HttpResponseEntity<T>>(url, body, {
        observe: 'body'
      })
      .pipe(catchError(this.handleError<HttpResponseEntity<T>>()));
  }

  httpDelete<T>(url: string): Observable<HttpResponseEntity<T>> {
    return this.http
      .delete<HttpResponseEntity<T>>(url, {
        observe: 'body'
      })
      .pipe(catchError(this.handleError<HttpResponseEntity<T>>()));
  }

  httpPut<T>(url: string, body: Record<string, any> | FormData = {}): Observable<HttpResponseEntity<T>> {
    return this.http
      .put<HttpResponseEntity<T>>(url, body, {
        observe: 'body'
      })
      .pipe(catchError(this.handleError<HttpResponseEntity<T>>()));
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
