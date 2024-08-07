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
import {PeopleEditSelectedComponent} from './people-edit-selected/people-edit-selected.component';
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
import {PrintComponent} from './print/print.component';
import {BadgeTemplatesComponent} from './badge-templates/badge-templates.component';
import {PersonBadgePreviewComponent} from './person-badge-preview/person-badge-preview.component';
import {ScansFilterComponent} from './scans-filter/scans-filter.component';
import {SettingsComponent} from './settings/settings.component';
import {Wsi2022Component} from './badges/wsi2022/wsi2022.component';
import {BadgesDeterminerComponent} from './badges-determiner/badges-determiner.component';
import {Wsi2023CiwComponent} from './badges/wsi2023-ciw/wsi2023-ciw.component';
import {DefaultComponent} from './badges/default/default.component';
import {Wsi2023GaComponent} from './badges/wsi2023-ga/wsi2023-ga.component';
import {Wsi2024CpwComponent} from './badges/wsi2024-cpw/wsi2024-cpw.component';
import {SetupScanAppComponent} from './setup-scan-app/setup-scan-app.component';
import {AdhocPrintingComponent} from './adhoc-printing/adhoc-printing.component';
import {WebcamModule} from "ngx-webcam";
import {WebcamCaptureComponent} from './webcam-capture/webcam-capture.component';
import {Fi2024Component} from './badges/fi2024/fi2024.component';
import {BaseComponent} from './badges/base/base.component';
import { VehiclesComponent } from './vehicles/vehicles.component';
import { VehicleAddComponent } from './vehicle-add/vehicle-add.component';
import { Wsi2024WscComponent } from './badges/wsi2024-wsc/wsi2024-wsc.component';
import { VehicleComponent } from './vehicle/vehicle.component';
import { VehicleBadgeComponent } from './vehicle-badge/vehicle-badge.component';
import { VehiclePrintComponent } from './vehicle-print/vehicle-print.component';
import { EventIndexComponent } from './event-index/event-index.component';
import { DragDropModule } from '@angular/cdk/drag-drop';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, '/assets/i18n/', '.json?v=20240723100448');
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ErrorComponent,
    EventsComponent,
    EventComponent,
    EventIndexComponent,
    PeopleComponent,
    PeopleEditSelectedComponent,
    ScansComponent,
    PeopleFilterComponent,
    DelegateTypesComponent,
    ZonesComponent,
    PositionsComponent,
    PackageOptionsComponent,
    DelegateTypesFormComponent,
    ZonesFormComponent,
    PackageOptionsFormComponent,
    PersonComponent,
    PrintComponent,
    BadgeTemplatesComponent,
    PersonBadgePreviewComponent,
    ScansFilterComponent,
    SettingsComponent,
    Wsi2022Component,
    BadgesDeterminerComponent,
    Wsi2023CiwComponent,
    DefaultComponent,
    Wsi2023GaComponent,
    Wsi2024CpwComponent,
    Wsi2024WscComponent,
    SetupScanAppComponent,
    VehicleComponent,
    VehicleAddComponent,
    VehicleBadgeComponent,
    VehiclePrintComponent,
    VehiclesComponent,
    AdhocPrintingComponent,
    WebcamCaptureComponent,
    Fi2024Component,
    BaseComponent
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
    DragDropModule,
    NgxSkeletonLoaderModule,
    AngularToastifyModule,
    WebcamModule
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
