import { NgModule } from '@angular/core';
import { PostRoutingModule } from './post-routing.module';
import { PostComponent } from './post.component';
import { TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import { CommonModule } from '@angular/common';
import { HighlightService } from '../../services/highlight.service';

@NgModule({
  imports: [
    PostRoutingModule,
    CommonModule,
    PostComponent
  ],
  exports: [PostComponent],
  providers: [
    { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' },
    HighlightService
  ]
})
export class PostModule {
}
