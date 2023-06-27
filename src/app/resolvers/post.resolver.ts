import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { PostEntity } from '../interfaces/posts';
import { TransferHttpService } from '../services/transfer-http.service';
import { HttpResponseEntity } from '../interfaces/http-response';
import { ApiUrl } from '../config/api-url';
import { map } from 'rxjs/operators';

export const postResolver: ResolveFn<PostEntity | undefined> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const http = inject(TransferHttpService);
  return http
    .get<HttpResponseEntity<PostEntity>>(
      http.getApiUrl(ApiUrl.GET_POST_BY_SLUG).replace(':slug', route.paramMap.get('postSlug')!)
    )
    .pipe(map((res) => res?.data || undefined));
};
