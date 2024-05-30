import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { PostListComponent } from './post-list.component';

const routes: Routes = [
  {
    path: ':tag',
    component: PostListComponent
  },
  {
    path: 'search/:query',
    component: PostListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PostListRoutingModule {
}
