import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {postListUrlMatcher} from './config/post-list.matcher';
import {postPageUrlMatcher} from './config/post-page.matcher';
import {tagUrlMatcher} from './config/tags.matcher';
import {LayoutComponent} from './components/layout/layout.component';
import {NotFoundComponent} from './pages/not-found/not-found.component';
import {PostListComponent} from './pages/post-list/post-list.component';
import {PostComponent} from './pages/post/post.component';
import {ProjectsComponent} from './pages/projects/projects.component';
import {AboutComponent} from './pages/about/about.component';
import {searchMatcher} from './config/search.matcher';
import {adminPostEditMatcher} from "./config/admin-post-edit.matcher";
import {AdminPostComponent} from "./pages/admin-post/admin-post.component";
import {adminGuard} from "./core/admin.guard";
import {adminPostCreateMatcher} from "./config/admin-post-create.matcher";

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
      path: '404',
      component: NotFoundComponent
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
      /* admin/post/:postSlug */
      matcher: adminPostEditMatcher,
      component: AdminPostComponent,
      canActivate: [adminGuard]
    }, {
      /* admin/post */
      matcher: adminPostCreateMatcher,
      component: AdminPostComponent,
      canActivate: [adminGuard]
    }, {
      /* :postSlug */
      matcher: postPageUrlMatcher,
      component: PostComponent
    }, {
      path: '**',
      component: NotFoundComponent
    }]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    anchorScrolling: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
