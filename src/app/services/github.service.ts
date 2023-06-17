import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GithubRepo } from '../interfaces/github-repo';
import { HttpClient } from '@angular/common/http';
import { Options } from '../config/site-options';

@Injectable({
  providedIn: 'root'
})
export class GithubService {
  constructor(private http: HttpClient) {}

  getApiProjects(): Observable<GithubRepo[] | undefined> {
    return this.http.get<GithubRepo[]>(Options.GITHUB_API_URL).pipe(map((res) => res || undefined));
  }
}
