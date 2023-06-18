import { APP_BASE_HREF, CommonModule, registerLocaleData } from '@angular/common';
import { HttpClientModule, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { APP_ID, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { TransferHttpCacheModule } from '@nguniversal/common';
import { environment as env } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { LayoutComponent } from './components/layout/layout.component';
import { MessageModule } from './components/message/message.module';
import { ModalComponent } from './components/modal/modal.component';
import { PageBarComponent } from './components/page-bar/page-bar.component';
import { SearchModalComponent } from './components/search-modal/search-modal.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { PostListComponent } from './pages/post-list/post-list.component';
import { PostComponent } from './pages/post/post.component';
import { PipesModule } from './pipes/pipes.module';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { ProjectsComponent } from './pages/projects/projects.component';
import { AboutComponent } from './pages/about/about.component';
import en from '@angular/common/locales/en';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ScrollTopComponent } from './components/scroll-top/scroll-top.component';
import { ImgFallbackModule } from 'ngx-img-fallback';
import { AdminPostComponent } from './pages/admin-post/admin-post.component';
import { TagInputModule } from 'ngx-chips';
import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';
import { HighlightService } from './services/highlight.service';
import { ThemeService } from './services/theme.service';
import { TocComponent } from './components/toc/toc.component';
import { CoolStorageModule } from '@angular-cool/storage';

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
    ScrollTopComponent,
    TocComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
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
    CoolStorageModule.forRoot()
  ],
  providers: [
    { provide: APP_BASE_HREF, useValue: env.site },
    { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' },
    { provide: APP_ID, useValue: 'vendelieu' },
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimations(),
    provideClientHydration(),
    HighlightService,
    ThemeService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
