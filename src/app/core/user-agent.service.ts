import { Inject, Injectable, Optional } from '@angular/core';
import { REQUEST } from '@nguniversal/express-engine/tokens';
import { Request } from 'express';
import { IDevice, IResult, UAParser } from 'ua-parser-js';
import { PlatformService } from './platform.service';

@Injectable({
  providedIn: 'root'
})
export class UserAgentService {
  public readonly userAgent!: IResult;

  private userAgentString: string = '';

  constructor(
    private platform: PlatformService,
    @Optional() @Inject(REQUEST) private request: Request
  ) {
    this.userAgentString = this.platform.isBrowser ? navigator.userAgent : (this.request.headers['user-agent'] || '');
    this.userAgent = UAParser(this.userAgentString);
  }

  get device(): IDevice {
    return this.userAgent.device;
  }


  isMobile() {
    return this.device.type === 'mobile';
  }
}
