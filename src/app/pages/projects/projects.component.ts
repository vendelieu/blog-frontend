import { Component, OnInit } from '@angular/core';
import { GithubRepo } from '../../interfaces/github-repo';
import { GithubService } from '../../services/github.service';
import { faCode, faTerminal } from '@fortawesome/free-solid-svg-icons';
import { Options } from '../../config/site-options';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.less']
})
export class ProjectsComponent implements OnInit {
  tabOption = 0;
  loading = false;
  githubProjects: GithubRepo[] | undefined = undefined;
  projectIcon = faCode;
  langIcon = faTerminal;
  email = Options.email;

  constructor(private githubService: GithubService) {}

  public ngOnInit() {
    this.loading = true;
    this.githubService.getApiProjects().subscribe((res) => {
      this.githubProjects = res;
      this.loading = false;
    });
  }
}
