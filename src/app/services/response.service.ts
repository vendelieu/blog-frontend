import { Inject, Injectable, Optional } from '@angular/core';
import { Response } from 'express';
import { RESPONSE } from '../../express.tokens';

@Injectable({
  providedIn: 'root'
})
export class ResponseService {
  constructor(@Optional() @Inject(RESPONSE) protected response: Response) {
  }

  setStatus(code: number): void {
    this.response.status(code);
  }
}
