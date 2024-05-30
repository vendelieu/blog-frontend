import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { PostEntity } from '../../interfaces/posts';
import { HttpResponseEntity } from '../../interfaces/http-response';
import { ApiUrl } from '../../config/api-url';
import { map } from 'rxjs/operators';
import { getApiUrl } from '../../helpers/urlFormer';
import { HttpClient } from '@angular/common/http';

export const postResolver: ResolveFn<PostEntity | undefined> = (
  route: ActivatedRouteSnapshot
) => {
  const http = inject(HttpClient);
  return http
    .get<HttpResponseEntity<PostEntity>>(
      getApiUrl(ApiUrl.GET_POST_BY_SLUG).replace(':slug', route.paramMap.get('slug')!)
    )
    .pipe(map((res) => res?.data || undefined));
};
