import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GITHUB_API_URL } from '../config/constants';
import { map } from 'rxjs/operators';
import { GithubRepo } from '../interfaces/github-repo';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GithubService {

  constructor(private http: HttpClient) {
  }

  getApiProjects(): Observable<GithubRepo[] | undefined> {
    return this.http.get<GithubRepo[]>(GITHUB_API_URL).pipe(
      map((res) => res || undefined)
    );
  }
}
