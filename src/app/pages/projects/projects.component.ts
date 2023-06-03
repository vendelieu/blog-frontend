import { Component, OnInit } from '@angular/core';
import { GithubRepo } from '../../interfaces/github-repo';
import { GithubService } from '../../services/github.service';
import { faCode, faTerminal } from '@fortawesome/free-solid-svg-icons';
import { Options } from '../../config/site-options';
import { MetaService } from '../../core/meta.service';
import { HTMLMetaData } from '../../interfaces/meta';
import { OptionEntity } from '../../interfaces/options';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.less']
})
export class ProjectsComponent implements OnInit {
  private options: OptionEntity = Options;
  loading = false;
  githubProjects: GithubRepo[] | undefined = undefined;
  projectIcon = faCode;
  langIcon = faTerminal;
  email = this.options['email'];

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
      title: this.options['site_name'] + ' - ' + 'Projects',
      description: this.options['site_description'],
      keywords: this.options['site_keywords']
    };
    this.metaService.updateHTMLMeta(metaData);
  }
}
