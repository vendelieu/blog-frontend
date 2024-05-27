import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';
import { AppModule } from './app.module';
import { AppComponent } from './app.component';
import { provideClientHydration, withHttpTransferCacheOptions } from '@angular/platform-browser';

@NgModule({
  imports: [AppModule, ServerModule],
  providers: [
    provideClientHydration(
      withHttpTransferCacheOptions({
        includePostRequests: true
      }))
  ],
  bootstrap: [AppComponent]
})
export class AppServerModule {
}
