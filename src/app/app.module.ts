import {APP_BASE_HREF, NgOptimizedImage, registerLocaleData} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserModule, BrowserTransferStateModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {TransferHttpCacheModule} from '@nguniversal/common';
import {environment as env} from '../environments/environment';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {FooterComponent} from './components/footer/footer.component';
import {HeaderComponent} from './components/header/header.component';
import {LayoutComponent} from './components/layout/layout.component';
import {MessageModule} from './components/message/message.module';
import {ModalComponent} from './components/modal/modal.component';
import {PageBarComponent} from './components/page-bar/page-bar.component';
import {SearchModalComponent} from './components/search-modal/search-modal.component';
import {NotFoundComponent} from './pages/not-found/not-found.component';
import {PostListComponent} from './pages/post-list/post-list.component';
import {PostComponent} from './pages/post/post.component';
import {PipesModule} from './pipes/pipes.module';
import {ClipboardModule} from '@angular/cdk/clipboard';
import {ProjectsComponent} from './pages/projects/projects.component';
import {AboutComponent} from './pages/about/about.component';
import en from '@angular/common/locales/en';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {ScrollTopComponent} from './components/scroll-top/scroll-top.component';
import {ImgFallbackModule} from "ngx-img-fallback";
import {AdminPostComponent} from "./pages/admin-post/admin-post.component";
import {TagInputModule} from "ngx-chips";
import {EditorModule, TINYMCE_SCRIPT_SRC} from "@tinymce/tinymce-angular";
import {HighlightService} from "./services/highlight.service";
import {ThemeService} from "./services/theme.service";

registerLocaleData(en);

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    HeaderComponent,
    SearchModalComponent,
    PageBarComponent,
    FooterComponent,
    ModalComponent,
    PostListComponent,
    PostComponent,
    NotFoundComponent,
    ProjectsComponent,
    AboutComponent,
    AdminPostComponent,
    ScrollTopComponent
  ],
  imports: [
    BrowserModule.withServerTransition({appId: 'blogApp'}),
    BrowserTransferStateModule,
    TransferHttpCacheModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    PipesModule,
    MessageModule,
    FontAwesomeModule,
    ClipboardModule,
    ImgFallbackModule,
    EditorModule,
    TagInputModule,
    NgOptimizedImage
  ],
  providers: [
    {provide: APP_BASE_HREF, useValue: env.site},
    {provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js'},
    HighlightService,
    ThemeService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
