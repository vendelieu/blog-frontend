import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {ApiService} from '../core/api.service';
import {ApiUrl} from '../config/api-url';
import {Tag} from '../interfaces/tag';

@Injectable({
  providedIn: 'root'
})
export class TagsService {
  constructor(
    private apiService: ApiService
  ) {
  }

  getByPostSlug(slug: string): Observable<Tag | undefined> {
    return this.apiService.httpGet<Tag>(this.apiService.getApiUrl(ApiUrl.GET_TAGS_BY_POST_SLUG), {
      slug
    }).pipe(
      map((res) => res.data || undefined)
    );
  }

  getByName(slug: string): Observable<Tag[] | undefined> {
    return this.apiService.httpGet<Tag[]>(
      this.apiService.getApiUrl(ApiUrl.GET_TAG_BY_NAME).replace(':name', slug)
    ).pipe(map((res) => res.data || undefined));
  }
}
