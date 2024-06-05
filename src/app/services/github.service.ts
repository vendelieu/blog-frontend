import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GithubRepo } from '../interfaces/github-repo';
import { Options } from '../config/site-options';
import { HttpClient } from '@angular/common/http';
import { CacheService } from './caching.service';

@Injectable({
  providedIn: 'root'
})
export class GithubService {
  constructor(private httpClient: HttpClient, private cacheService: CacheService) {
  }

  getApiProjects(): Observable<GithubRepo[]> {
    return this.cacheService.cacheObservable(Options.GITHUB_API_URL, this.httpClient.get<GithubRepo[]>(Options.GITHUB_API_URL));
  }
}
