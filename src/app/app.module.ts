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
import {EventsComponent} from './events/events.component';
import {NgbModule, NgbPagination} from "@ng-bootstrap/ng-bootstrap";
import {EventComponent} from './event/event.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatTabsModule} from "@angular/material/tabs";
import {PeopleComponent} from './people/people.component';
import {ScansComponent} from './scans/scans.component';
import {PeopleFilterComponent} from './people-filter/people-filter.component';
import {FormsModule} from "@angular/forms";
import {NgxSkeletonLoaderModule} from "ngx-skeleton-loader";
import {DelegateTypesComponent} from './delegate-types/delegate-types.component';
import {ZonesComponent} from './zones/zones.component';
import {PositionsComponent} from './positions/positions.component';
import {PackageOptionsComponent} from './package-options/package-options.component';
import {DelegateTypesFormComponent} from './delegate-types-form/delegate-types-form.component';
import {AngularToastifyModule, ToastService} from "angular-toastify";
import {ZonesFormComponent} from './zones-form/zones-form.component';
import {PackageOptionsFormComponent} from './package-options-form/package-options-form.component';
import {PersonComponent} from './person/person.component';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, '/assets/i18n/', '.json?v=20231109');
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ErrorComponent,
    EventsComponent,
    EventComponent,
    PeopleComponent,
    ScansComponent,
    PeopleFilterComponent,
    DelegateTypesComponent,
    ZonesComponent,
    PositionsComponent,
    PackageOptionsComponent,
    DelegateTypesFormComponent,
    ZonesFormComponent,
    PackageOptionsFormComponent,
    PersonComponent
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
    BrowserAnimationsModule,
    MatTabsModule,
    FormsModule,
    NgxSkeletonLoaderModule,
    AngularToastifyModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: WsHttpInterceptor, multi: true},
    ToastService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
