import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from '../core/api.service';
import { ApiUrl } from '../config/api-url';
import { NewTag, Tag } from '../interfaces/tag';

@Injectable({
  providedIn: 'root'
})
export class TagsService {
  constructor(private apiService: ApiService) {}

  getByPostSlug(slug: string): Observable<Tag | undefined> {
    return this.apiService
      .httpGet<Tag>(this.apiService.getApiUrl(ApiUrl.GET_TAGS_BY_POST_SLUG), {
        slug
      })
      .pipe(map((res) => res.data || undefined));
  }

  getByName(slug: string): Observable<Tag[] | undefined> {
    return this.apiService.httpGet<Tag[]>(this.apiService.getApiUrl(ApiUrl.GET_TAG_BY_NAME).replace(':name', slug)).pipe(map((res) => res.data || undefined));
  }

  create(tag: NewTag): Observable<string | undefined> {
    return this.apiService.httpPost<string>(this.apiService.getApiUrl(ApiUrl.ADMIN_TAG_ACTION), tag).pipe(map((res) => res.data || undefined));
  }

  link(postSlug: string, tagSlug: string): Observable<string | undefined> {
    return this.apiService.httpPut<string>(this.apiService.getApiUrl(ApiUrl.ADMIN_TAG_ACTION), { post_slug: postSlug, tag_slug: tagSlug }).pipe(map((res) => res.data || undefined));
  }

  unlink(postSlug: string, tagSlug: string): Observable<string | undefined> {
    return this.apiService.httpDelete<string>(this.apiService.getApiUrl(ApiUrl.ADMIN_TAG_UNLINK).replace(':slug', tagSlug).replace(':post_slug', postSlug)).pipe(map((res) => res.data || undefined));
  }
}
