import { Component, OnInit } from '@angular/core';
import { MetaService } from '../../services/meta.service';
import { HTMLMetaData } from '../../interfaces/meta';
import { Options } from '../../config/site-options';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.less'],
  standalone: true
})
export class AboutComponent implements OnInit {
  constructor(private metaService: MetaService) {}

  ngOnInit(): void {
    this.initMeta();
  }

  private initMeta() {
    const metaData: HTMLMetaData = {
      title: Options.site_name + ' - ' + 'About',
      description: Options.site_description,
      keywords: Options.site_keywords
    };
    this.metaService.updateHTMLMeta(metaData);
  }
}
