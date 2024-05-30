import { HttpStatusCode } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { PlatformService } from '../../services/platform.service';
import { ResponseService } from '../../services/response.service';
import { MetaService } from '../../services/meta.service';
import { Options } from '../../config/site-options';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.less'],
  standalone: true
})
export class NotFoundComponent implements OnInit {
  constructor(
    private platform: PlatformService,
    private response: ResponseService,
    private metaService: MetaService
  ) {
  }

  ngOnInit(): void {
    if (this.platform.isServer) {
      this.response.setStatus(HttpStatusCode.NotFound);
    }
    this.metaService.updateHTMLMeta({
      title: `404 - ${Options.site_name}`,
      description: Options.site_description,
      keywords: Options.site_keywords
    });
  }
}
