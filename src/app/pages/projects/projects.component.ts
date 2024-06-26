import { Component, OnInit } from '@angular/core';
import { GithubRepo } from '../../interfaces/github-repo';
import { GithubService } from '../../services/github.service';
import { faCode, faTerminal } from '@fortawesome/free-solid-svg-icons';
import { Options } from '../../config/site-options';
import { MetaService } from '../../services/meta.service';
import { HTMLMetaData } from '../../interfaces/meta';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.less'],
  imports: [FontAwesomeModule],
  standalone: true
})
export class ProjectsComponent implements OnInit {
  loading = false;
  githubProjects: GithubRepo[] | undefined = undefined;
  projectIcon = faCode;
  langIcon = faTerminal;
  email = Options.email;

  constructor(private githubService: GithubService, private metaService: MetaService) {
  }

  public ngOnInit() {
    this.initMeta();
    this.loading = true;
    this.githubService.getApiProjects().subscribe((res) => {
      this.githubProjects = res;
      this.loading = false;
    });
  }

  private initMeta() {
    const metaData: HTMLMetaData = {
      title: Options.site_name + ' - ' + 'Projects',
      description: Options.site_description,
      keywords: Options.site_keywords
    };
    this.metaService.updateHTMLMeta(metaData);
  }
}
