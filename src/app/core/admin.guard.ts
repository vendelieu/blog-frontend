import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { ApiUrl } from '../config/api-url';
import { of, tap } from 'rxjs';
import { TransferHttpService } from '../services/transfer-http.service';
import { CoolLocalStorage } from '@angular-cool/storage';
import { Options } from '../config/site-options';

export const adminGuard = () => {
  return of(true);
  const router = inject(Router);
  const apiService = inject(TransferHttpService);
  const storage = inject(CoolLocalStorage);
  storage.removeItem(Options.STORAGE_ADMIN_MARK);

  return apiService.checkAccess(apiService.getAdminUrl(ApiUrl.ADMIN_STATUS_URL)).pipe(
    tap((value) => {
      return !value ? router.navigate(['/']) : true;
    })
  );
};
