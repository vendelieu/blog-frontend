import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GithubRepo } from '../interfaces/github-repo';
import { Options } from '../config/site-options';
import { TransferHttpService } from './transfer-http.service';

@Injectable({
  providedIn: 'root'
})
export class GithubService {
  constructor(private transferHttp: TransferHttpService) {}

  getApiProjects(): Observable<GithubRepo[]> {
    return this.transferHttp.get<GithubRepo[]>(Options.GITHUB_API_URL);
  }
}
