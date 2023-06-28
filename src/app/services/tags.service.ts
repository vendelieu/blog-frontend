import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiUrl } from '../config/api-url';
import { NewTag, Tag } from '../interfaces/tag';
import { TransferHttpService } from './transfer-http.service';
import { HttpResponseEntity } from '../interfaces/http-response';

@Injectable({
  providedIn: 'root'
})
export class TagsService {
  constructor(private transferHttp: TransferHttpService) {}

  getByPostSlug(slug: string): Observable<Tag | undefined> {
    return this.transferHttp
      .get<HttpResponseEntity<Tag>>(this.transferHttp.getApiUrl(ApiUrl.GET_TAGS_BY_POST_SLUG), {
        params: slug
      })
      .pipe(map((res) => res.data || undefined));
  }

  getByName(slug: string): Observable<Tag[] | undefined> {
    return this.transferHttp
      .get<HttpResponseEntity<Tag[]>>(
        this.transferHttp.getApiUrl(ApiUrl.GET_TAG_BY_NAME).replace(':name', slug)
      )
      .pipe(map((res) => res.data || undefined));
  }

  create(tag: NewTag): Observable<string | undefined> {
    return this.transferHttp
      .post<HttpResponseEntity<string>>(this.transferHttp.getAdminUrl(ApiUrl.ADMIN_TAG_ACTION), tag)
      .pipe(map((res) => res.data || undefined));
  }

  link(postSlug: string, tagSlug: string): Observable<string | undefined> {
    return this.transferHttp
      .put<HttpResponseEntity<string>>(this.transferHttp.getAdminUrl(ApiUrl.ADMIN_TAG_ACTION), {
        post_slug: postSlug,
        tag_slug: tagSlug
      })
      .pipe(map((res) => res.data || undefined));
  }

  unlink(postSlug: string, tagSlug: string): Observable<string | undefined> {
    return this.transferHttp
      .delete<HttpResponseEntity<string>>(
        this.transferHttp
          .getAdminUrl(ApiUrl.ADMIN_TAG_UNLINK)
          .replace(':slug', tagSlug)
          .replace(':post_slug', postSlug)
      )
      .pipe(map((res) => res.data || undefined));
  }
}
