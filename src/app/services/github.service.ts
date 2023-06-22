import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GithubRepo } from '../interfaces/github-repo';
import { Options } from '../config/site-options';
import { ApiService } from '../core/api.service';

@Injectable({
  providedIn: 'root'
})
export class GithubService {
  constructor(private apiService: ApiService) {}

  getApiProjects(): Observable<GithubRepo[]> {
    return this.apiService.httpGetCustomResponse<GithubRepo[]>(Options.GITHUB_API_URL);
  }
}
