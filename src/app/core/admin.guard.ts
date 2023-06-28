import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { TransferHttpService } from '../services/transfer-http.service';
import { Options } from '../config/site-options';

export const adminGuard = () => {
  const router = inject(Router);
  const apiService = inject(TransferHttpService);
  return apiService.checkAccess(`${Options.api_url}:8080/api/admin/check`).pipe(
    tap((value) => {
      return !value ? router.navigate(['/']) : true;
    })
  );
};
