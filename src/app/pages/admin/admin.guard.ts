import { afterNextRender, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ApiUrl } from '../../config/api-url';
import { of, tap } from 'rxjs';
import { Options } from '../../config/site-options';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { getAdminUrl } from '../../helpers/urlFormer';

export const adminGuard = () => {
  const router = inject(Router);
  const httpClient = inject(HttpClient);
  afterNextRender(() => {
    localStorage.removeItem(Options.STORAGE_ADMIN_MARK);
  });

  return httpClient.get(getAdminUrl(ApiUrl.ADMIN_STATUS_URL), { observe: 'response' }).pipe(
    map((response: HttpResponse<any>) => response.status !== 403),
    catchError(() => of(false))
  ).pipe(
    tap((value) => {
      return !value ? router.navigate(['/']) : true;
    })
  );
};
