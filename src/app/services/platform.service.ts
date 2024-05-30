import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PlatformService {
  public isBrowser = isPlatformBrowser(this.platformId);
  public isServer = isPlatformServer(this.platformId);

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}
}
