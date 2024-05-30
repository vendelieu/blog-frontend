import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { adminGuard } from './admin.guard';

const routes: Routes = [
  {
    path: 'post', canActivate: [adminGuard], children: [
      {
        path: '',
        loadComponent: () => import('./post/adm-post.component').then((c) => c.AdmPostComponent)
      },
      {
        path: ':slug',
        loadComponent: () => import('./post/adm-post.component').then((c) => c.AdmPostComponent)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {
}
