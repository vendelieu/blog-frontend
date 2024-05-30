import { Component, CUSTOM_ELEMENTS_SCHEMA, Input } from '@angular/core';
import { ThemeService } from '../../services/theme.service';
import { CommonModule } from '@angular/common';

import 'giscus';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.less'],
  imports: [CommonModule],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CommentsComponent {
  theme: string = 'dark';
  @Input('show') showComments!: boolean;
  isExpanded = true;

  constructor(themeService: ThemeService,) {
    themeService.themeChanges.subscribe((e) => {
      this.theme = e;
    });
  }

  refresh() {
    this.isExpanded = true;
  }

  toggleComments() {
    this.isExpanded = !this.isExpanded;
  }
}
