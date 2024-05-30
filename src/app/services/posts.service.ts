import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiUrl } from '../config/api-url';
import { NavPost, PostEntity, PostQueryParam } from '../interfaces/posts';
import { HttpResponseEntity, PaginatedHttpResponse } from '../interfaces/http-response';
import { HttpClient } from '@angular/common/http';
import { getAdminUrl, getApiUrl } from '../helpers/urlFormer';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  constructor(private httpClient: HttpClient) {
  }

  getPosts(param: PostQueryParam): Observable<PaginatedHttpResponse<PostEntity[]> | undefined> {
    return this.httpClient.get<PaginatedHttpResponse<PostEntity[]>>(
      getApiUrl(ApiUrl.GET_POSTS),
      { params: param as any }
    );
  }

  getPostBySlug(slug: string): Observable<PostEntity | undefined> {
    return this.httpClient
      .get<HttpResponseEntity<PostEntity>>(
        getApiUrl(ApiUrl.GET_POST_BY_SLUG).replace(':slug', slug)
      )
      .pipe(map((res) => res?.data || undefined));
  }

  getRelatedPostBySlug(slug: string): Observable<NavPost[] | undefined> {
    return this.httpClient
      .get<HttpResponseEntity<NavPost[]>>(
        getApiUrl(ApiUrl.GET_RELATED_POST_BY_SLUG).replace(':slug', slug)
      )
      .pipe(map((res) => res?.data || undefined));
  }

  updatePostById(id: number, body: Record<string, any>): Observable<boolean> {
    return this.httpClient
      .put<HttpResponseEntity<string>>(
        getAdminUrl(ApiUrl.ADMIN_POST_ACTION).replace(':id', id.toString()),
        body
      )
      .pipe(map((res) => res.code === 200));
  }

  createPost(body: Record<string, any>): Observable<boolean> {
    return this.httpClient
      .post<HttpResponseEntity<string>>(
        getAdminUrl(ApiUrl.ADMIN_CREATE_POST),
        body
      )
      .pipe(map((res) => res.code === 200));
  }

  deletePost(id: number) {
    return this.httpClient
      .delete<HttpResponseEntity<string>>(
        getAdminUrl(ApiUrl.ADMIN_POST_ACTION).replace(':id', id.toString())
      )
      .pipe(map((res) => res.code === 200));
  }
}
