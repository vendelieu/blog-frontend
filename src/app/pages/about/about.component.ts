import { Component, OnInit } from '@angular/core';
import { MetaService } from '../../core/meta.service';
import { HTMLMetaData } from '../../interfaces/meta';
import { OptionEntity } from '../../interfaces/options';
import { Options } from '../../config/site-options';
import { CUR_YEAR } from '../../config/constants';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.less']
})
export class AboutComponent implements OnInit {
  curYear = CUR_YEAR;
  private options: OptionEntity = Options;

  constructor(private metaService: MetaService) {
  }

  ngOnInit(): void {
    this.initMeta();
  }

  private initMeta() {
    const metaData: HTMLMetaData = {
      title: this.options['site_name'] + ' - ' + 'About',
      description: this.options['site_description'],
      keywords: this.options['site_keywords']
    };
    this.metaService.updateHTMLMeta(metaData);
  }
}
