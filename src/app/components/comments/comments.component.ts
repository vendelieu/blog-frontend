import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { ThemeService } from '../../services/theme.service';


import 'giscus';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.less'],
  imports: [],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CommentsComponent {
  theme: string = 'dark';
  @Input('show') showComments!: boolean;
  isExpanded = false;

  constructor(themeService: ThemeService) {
    themeService.themeChanges.subscribe((e) => {
      this.theme = e;
    });
  }

  refresh() {
    this.isExpanded = false;
  }

  toggleComments() {
    this.isExpanded = !this.isExpanded;
  }
}
