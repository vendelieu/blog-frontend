import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiUrl } from '../config/api-url';
import { NavPost, PostEntity, PostQueryParam } from '../interfaces/posts';
import { HttpResponseEntity, PaginatedHttpResponse } from '../interfaces/http-response';
import { TransferHttpService } from './transfer-http.service';

@Injectable({
  providedIn: 'root'
})
export class PostsService {
  constructor(private transferHttp: TransferHttpService) {}

  getPosts(param: PostQueryParam): Observable<PaginatedHttpResponse<PostEntity[]> | undefined> {
    return this.transferHttp.get<PaginatedHttpResponse<PostEntity[]>>(
      this.transferHttp.getApiUrl(ApiUrl.GET_POSTS),
      { params: param }
    );
  }

  getPostBySlug(slug: string): Observable<PostEntity | undefined> {
    return this.transferHttp
      .get<HttpResponseEntity<PostEntity>>(
        this.transferHttp.getApiUrl(ApiUrl.GET_POST_BY_SLUG).replace(':slug', slug)
      )
      .pipe(map((res) => res?.data || undefined));
  }

  getRelatedPostBySlug(slug: string): Observable<NavPost[] | undefined> {
    return this.transferHttp
      .get<HttpResponseEntity<NavPost[]>>(
        this.transferHttp.getApiUrl(ApiUrl.GET_RELATED_POST_BY_SLUG).replace(':slug', slug)
      )
      .pipe(map((res) => res?.data || undefined));
  }

  updatePostById(id: number, body: Record<string, any>): Observable<boolean> {
    return this.transferHttp
      .put<HttpResponseEntity<string>>(
        this.transferHttp.getApiUrl(ApiUrl.ADMIN_POST_ACTION).replace(':id', id.toString()),
        body
      )
      .pipe(map((res) => res.code === 200));
  }

  createPost(body: Record<string, any>): Observable<boolean> {
    return this.transferHttp
      .post<HttpResponseEntity<string>>(this.transferHttp.getApiUrl(ApiUrl.ADMIN_CREATE_POST), body)
      .pipe(map((res) => res.code === 200));
  }

  deletePost(id: number) {
    return this.transferHttp
      .delete<HttpResponseEntity<string>>(
        this.transferHttp.getApiUrl(ApiUrl.ADMIN_POST_ACTION).replace(':id', id.toString())
      )
      .pipe(map((res) => res.code === 200));
  }
}
