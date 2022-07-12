import { APP_BASE_HREF, registerLocaleData } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
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
import { SiderMobileComponent } from './components/sider-mobile/sider-mobile.component';
import { SearchModalComponent } from './components/search-modal/search-modal.component';
import { AutofocusDirective } from './directives/autofocus.directive';
import { LoginComponent } from './pages/login/login.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { PostListComponent } from './pages/post-list/post-list.component';
import { PostComponent } from './pages/post/post.component';
import { PipesModule } from './pipes/pipes.module';
import { httpInterceptorProviders } from './interceptors/http-interceptors';
import { ClipboardButtonComponent, ClipboardOptions, MarkdownModule } from 'ngx-markdown';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { ProjectsComponent } from './pages/projects/projects.component';
import { AboutComponent } from './pages/about/about.component';
import en from '@angular/common/locales/en';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ScrollTopComponent } from './components/scroll-top/scroll-top.component';

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
    LoginComponent,
    NotFoundComponent,
    AutofocusDirective,
    SiderMobileComponent,
    ProjectsComponent,
    AboutComponent,
    ScrollTopComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'blogApp' }),
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
    MarkdownModule.forRoot({
      clipboardOptions: {
        provide: ClipboardOptions,
        useValue: {
          buttonComponent: ClipboardButtonComponent
        }
      }
    })
  ],
  providers: [httpInterceptorProviders, { provide: APP_BASE_HREF, useValue: env.host }],
  bootstrap: [AppComponent]
})
export class AppModule {
}
