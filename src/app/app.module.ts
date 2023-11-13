import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {WorldskillsAngularLibModule, WsHttpInterceptor} from "@worldskills/worldskills-angular-lib";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {HTTP_INTERCEPTORS, HttpClient} from "@angular/common/http";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import {OAuthModule} from "angular-oauth2-oidc";
import {ErrorInterceptor} from "../interceptors/error-interceptor";
import {HomeComponent} from "./home/home.component";
import {ErrorComponent} from "./error/error.component";
import {NgSelectModule} from "@ng-select/ng-select";
import { EventsComponent } from './events/events.component';
import {NgbPagination, NgbModule} from "@ng-bootstrap/ng-bootstrap";

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, '/assets/i18n/', '.json?v=20231109');
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ErrorComponent,
    EventsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    OAuthModule.forRoot(),
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    WorldskillsAngularLibModule,
    NgSelectModule,
    NgbPagination,
    NgbModule,
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: WsHttpInterceptor, multi: true},
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
