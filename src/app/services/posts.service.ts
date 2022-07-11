import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from '../core/api.service';
import { ApiUrl } from '../config/api-url';
import { NavPost, PostEntity, PostQueryParam } from '../interfaces/posts';
import { PaginatedHttpResponse } from '../interfaces/http-response';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  constructor(
    private apiService: ApiService
  ) {
  }

  getPosts(param: PostQueryParam): Observable<PaginatedHttpResponse<PostEntity[]> | undefined> {
    return this.apiService.httpGetCustomResponse<PaginatedHttpResponse<PostEntity[]>>(
      this.apiService.getApiUrl(ApiUrl.GET_POSTS), param
    ).pipe(
      map((res) => res || undefined)
    );
  }

  getPostBySlug(slug: string): Observable<PostEntity | undefined> {
    return this.apiService.httpGet<PostEntity>(
      this.apiService.getApiUrl(ApiUrl.GET_POST_BY_SLUG).replace(':slug', slug)
    ).pipe(
      map((res) => res?.data || undefined)
    );
  }

  getRelatedPostBySlug(slug: string): Observable<NavPost[] | undefined> {
    return this.apiService.httpGet<NavPost[]>(
      this.apiService.getApiUrl(ApiUrl.GET_RELATED_POST_BY_SLUG).replace(':slug', slug)
    ).pipe(
      map((res) => res?.data || undefined)
    );
  }
}
