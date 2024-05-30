import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostListRoutingModule } from './post-list-routing.module';
import { PostListComponent } from './post-list.component';

@NgModule({
  imports: [
    CommonModule,
    PostListRoutingModule,
    PostListComponent
  ],
  exports: [
    PostListComponent
  ]
})
export class PostListModule {
}
