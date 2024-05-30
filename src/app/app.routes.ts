import { Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadComponent: () => import('./pages/post-list/post-list.component').then((c) => c.PostListComponent)
      },
      {
        path: 'post',
        loadChildren: () => import('./pages/post/post.module').then((m) => m.PostModule)
      },
      {
        path: 'tag',
        loadChildren: () => import('./pages/post-list/post-list.module').then((m) => m.PostListModule)
      },
      {
        path: 'search',
        loadChildren: () => import('./pages/post-list/post-list.module').then((m) => m.PostListModule)
      },
      {
        path: 'projects',
        loadComponent: () => import('./pages/projects/projects.component').then((c) => c.ProjectsComponent)
      },
      {
        path: 'about',
        loadComponent: () => import('./pages/about/about.component').then((c) => c.AboutComponent)
      },
      {
        path: '404',
        loadComponent: () => import('./pages/not-found/not-found.component').then((c) => c.NotFoundComponent)
      },
      {
        path: 'admin',
        loadChildren: () => import('./pages/admin/admin.module').then((m) => m.AdminModule)
      },
      {
        path: '**',
        loadComponent: () => import('./pages/not-found/not-found.component').then((c) => c.NotFoundComponent)
      }
    ]
  }
];
