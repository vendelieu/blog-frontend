import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GithubRepo } from '../interfaces/github-repo';
import { Options } from '../config/site-options';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GithubService {
  constructor(private httpClient: HttpClient) {
  }

  getApiProjects(): Observable<GithubRepo[]> {
    return this.httpClient.get<GithubRepo[]>(Options.GITHUB_API_URL);
  }
}
