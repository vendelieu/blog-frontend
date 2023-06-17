import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from './api.service';
import { ApiUrl } from '../config/api-url';
import { tap } from 'rxjs';

export const adminGuard = () => {
  const router = inject(Router);
  const apiService = inject(ApiService);
  return apiService.checkAccess(apiService.getApiUrl(ApiUrl.ADMIN_STATUS_URL)).pipe(
    tap((value) => {
      return !value ? router.navigate(['/']) : true;
    })
  );
};
