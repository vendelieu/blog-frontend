import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UrlHistory } from '../interfaces/url';
import { MetaService } from './meta.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UrlService {
  private urlInfo: BehaviorSubject<UrlHistory> = new BehaviorSubject<UrlHistory>({
    previous: '',
    current: ''
  });
  public urlInfo$: Observable<UrlHistory> = this.urlInfo.asObservable();

  constructor(private metaService: MetaService) {}

  updatePreviousUrl(urlInfo: UrlHistory) {
    this.urlInfo.next(urlInfo);
    this.metaService.updateCanonicalUrl(environment.site + urlInfo.current);
  }
}
