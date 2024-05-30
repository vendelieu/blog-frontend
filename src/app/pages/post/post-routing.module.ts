import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { postResolver } from './post.resolver';

const routes: Routes = [
  {
    path: ':slug',
    resolve: { postEntity: postResolver },
    loadComponent: () => import('./post.component').then((c) => c.PostComponent)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PostRoutingModule {
}
