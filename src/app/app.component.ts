import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { UrlService } from './core/url.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
  private currentUrl: string = '';

  constructor(private router: Router, private urlService: UrlService) {}

  ngOnInit(): void {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.urlService.updatePreviousUrl({
          previous: this.currentUrl,
          current: (event as NavigationEnd).url
        });
        this.currentUrl = (event as NavigationEnd).url;
      });
  }
}
