import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiUrl } from '../config/api-url';
import { Tag, TagDTO } from '../interfaces/tag';
import { HttpResponseEntity } from '../interfaces/http-response';
import { HttpClient } from '@angular/common/http';
import { getAdminUrl, getApiUrl } from '../helpers/urlFormer';

@Injectable({
  providedIn: 'root'
})
export class TagsService {
  constructor(private httpClient: HttpClient) {
  }

  getByName(slug: string): Observable<TagDTO[] | undefined> {
    return this.httpClient
      .get<HttpResponseEntity<TagDTO[]>>(
        getApiUrl(ApiUrl.GET_TAG_BY_NAME).replace(':name', slug)
      )
      .pipe(map((res) => res.data || undefined));
  }

  create(tag: Tag): Observable<string | undefined> {
    return this.httpClient
      .post<HttpResponseEntity<string>>(getAdminUrl(ApiUrl.ADMIN_TAG_ACTION), tag)
      .pipe(map((res) => res.data || undefined));
  }

  link(postSlug: string, tagSlug: string): Observable<string | undefined> {
    return this.httpClient
      .put<HttpResponseEntity<string>>(getAdminUrl(ApiUrl.ADMIN_TAG_ACTION), {
        post_slug: postSlug,
        tag_slug: tagSlug
      })
      .pipe(map((res) => res.data || undefined));
  }

  unlink(postSlug: string, tagSlug: string): Observable<string | undefined> {
    return this.httpClient
      .delete<HttpResponseEntity<string>>(
        getAdminUrl(ApiUrl.ADMIN_TAG_UNLINK)
          .replace(':slug', tagSlug)
          .replace(':post_slug', postSlug)
      )
      .pipe(map((res) => res.data || undefined));
  }
}
