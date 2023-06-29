import { Component, Input } from '@angular/core';
import { ThemeService } from '../../services/theme.service';

import 'giscus';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.less']
})
export class CommentsComponent {
  theme: string = 'dark';
  @Input('show') showComments!: boolean;
  isExpanded = false;

  constructor(private themeService: ThemeService) {
    themeService.getFlow().subscribe((e) => {
      this.theme = e;
    });
  }

  toggleComments() {
    this.isExpanded = !this.isExpanded;
  }
}
