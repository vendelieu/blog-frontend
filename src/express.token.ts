import { InjectionToken } from '@angular/core';
import { Response } from 'express';
export const RESPONSE = new InjectionToken<Response>('RESPONSE');
