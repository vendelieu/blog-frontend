import {APP_BASE_HREF, NgOptimizedImage, registerLocaleData} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {NgModule, SecurityContext} from '@angular/core';
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
import {AutofocusDirective} from './directives/autofocus.directive';
import {NotFoundComponent} from './pages/not-found/not-found.component';
import {PostListComponent} from './pages/post-list/post-list.component';
import {PostComponent} from './pages/post/post.component';
import {PipesModule} from './pipes/pipes.module';
import {httpInterceptorProviders} from './interceptors/http-interceptors';
import {ClipboardButtonComponent, ClipboardOptions, MarkdownModule} from 'ngx-markdown';
import {ClipboardModule} from '@angular/cdk/clipboard';
import {ProjectsComponent} from './pages/projects/projects.component';
import {AboutComponent} from './pages/about/about.component';
import en from '@angular/common/locales/en';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {ScrollTopComponent} from './components/scroll-top/scroll-top.component';
import {ImgFallbackModule} from "ngx-img-fallback";

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
    AutofocusDirective,
    ProjectsComponent,
    AboutComponent,
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
    MarkdownModule.forRoot({
      sanitize: SecurityContext.NONE,
      clipboardOptions: {
        provide: ClipboardOptions,
        useValue: {
          buttonComponent: ClipboardButtonComponent
        }
      }
    }),
    NgOptimizedImage
  ],
  providers: [httpInterceptorProviders, {provide: APP_BASE_HREF, useValue: env.site}],
  bootstrap: [AppComponent]
})
export class AppModule {
}
