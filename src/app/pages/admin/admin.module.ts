import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AdminRoutingModule } from './admin-routing.module';
import { AdmPostComponent } from './post/adm-post.component';
import { TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';

@NgModule({
  imports: [
    CommonModule,
    AdminRoutingModule,
    AdmPostComponent
  ],
  exports: [AdmPostComponent],
  providers: [
    { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' }
  ]
})
export class AdminModule {
}
