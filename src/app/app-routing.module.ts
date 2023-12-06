import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {environment} from "../environments/environment";
import {ErrorComponent} from "./error/error.component";
import {EventsComponent} from "./events/events.component";
import {GuardService} from "@worldskills/worldskills-angular-lib";
import {HomeComponent} from "./home/home.component";
import {EventComponent} from "./event/event.component";
import {PeopleComponent} from "./people/people.component";
import {ScansComponent} from "./scans/scans.component";
import {DelegateTypesComponent} from "./delegate-types/delegate-types.component";
import {ZonesComponent} from "./zones/zones.component";
import {PositionsComponent} from "./positions/positions.component";
import {PackageOptionsComponent} from "./package-options/package-options.component";
import {PersonComponent} from "./person/person.component";
import {PrintComponent} from "./print/print.component";
import {BadgeTemplatesComponent} from "./badge-templates/badge-templates.component";

const ACR_ROLES = environment.appRoles;

function forAppCode(appCode: number, roles: Array<string>) {
  return roles.map(name => ({
    appCode,
    name
  }));
}

function getTitle(title: string): string {
  return title + ' | WorldSkills Accreditation';
}

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'events',
    canActivate: [GuardService],
    data: {
      roles: forAppCode(environment.worldskillsAppId, [ACR_ROLES.ADMIN, ACR_ROLES.EDIT, ACR_ROLES.EDIT_DELEGATE_TYPES, ACR_ROLES.EDIT_POSITIONS, ACR_ROLES.EDIT_ZONES, ACR_ROLES.PRINT])
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: EventsComponent
      },
      {
        path: ':eventId',
        component: EventComponent,
        data: {breadcrumb: 'Event'},
        children: [
          {
            path: '',
            pathMatch: 'full',
            redirectTo: 'people'
          },
          {
            path: 'badge-templates',
            data: {breadcrumb: 'Badge Templates'},
            component: BadgeTemplatesComponent
          },
          {
            path: 'people',
            data: {breadcrumb: 'People'},
            component: PeopleComponent
          },
          {
            path: 'people/:personAcrId',
            data: {breadcrumb: 'Person'},
            component: PersonComponent
          },
          {
            path: 'scans',
            data: {breadcrumb: 'Scan'},
            component: ScansComponent
          },
          {
            path: 'delegate-types',
            data: {breadcrumb: 'Delegate Types'},
            component: DelegateTypesComponent
          },
          {
            path: 'positions',
            data: {breadcrumb: 'Positions'},
            component: PositionsComponent
          },
          {
            path: 'package-options',
            data: {breadcrumb: 'Package Options'},
            component: PackageOptionsComponent
          },
          {
            path: 'zones',
            data: {breadcrumb: 'Zones'},
            component: ZonesComponent
          }
        ]
      }
    ]
  },
  {
    path: 'events/:eventId/print',
    component: PrintComponent,
  },
  {
    path: 'events/:eventId/print/:personAcrId',
    component: PrintComponent,
  },
  {
    path: 'not-authorized',
    component: ErrorComponent,
    data: {breadcrumb: 'Not authorized', error: 'Not authorized'}
  },
  {
    path: '**',
    component: ErrorComponent,
    data: {breadcrumb: 'Not found', error: 'Not found'}
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
