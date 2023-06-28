import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { ApiUrl } from '../config/api-url';
import { tap } from 'rxjs';
import { TransferHttpService } from '../services/transfer-http.service';

export const adminGuard = () => {
  const router = inject(Router);
  const apiService = inject(TransferHttpService);
  return apiService.checkAccess(apiService.getAdminUrl(ApiUrl.ADMIN_STATUS_URL)).pipe(
    tap((value) => {
      return !value ? router.navigate(['/']) : true;
    })
  );
};
