import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { postListUrlMatcher } from './config/post-list.matcher';
import { postPageUrlMatcher } from './config/post-page.matcher';
import { tagUrlMatcher } from './config/tags.matcher';
import { LayoutComponent } from './components/layout/layout.component';
import { LoginComponent } from './pages/login/login.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { PostListComponent } from './pages/post-list/post-list.component';
import { PostComponent } from './pages/post/post.component';
import { ProjectsComponent } from './pages/projects/projects.component';
import { AboutComponent } from './pages/about/about.component';
import { searchMatcher } from './config/search.matcher';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [{
      path: '',
      pathMatch: 'full',
      component: PostListComponent
    }, {
      path: 'projects',
      component: ProjectsComponent
    }, {
      path: 'about',
      component: AboutComponent
    }, {
      /* post/page-:page */
      matcher: postListUrlMatcher,
      component: PostListComponent
    }, {
      /* tag/:tag, tag/:tag/page-:page */
      matcher: tagUrlMatcher,
      component: PostListComponent
    }, {
      /* search/:query */
      matcher: searchMatcher,
      component: PostListComponent
    }, {
      /* :postSlug */
      matcher: postPageUrlMatcher,
      component: PostComponent
    }]
  }, {
    path: 'user/login',
    component: LoginComponent
  }, {
    path: '**',
    component: NotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabledBlocking',
    anchorScrolling: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
