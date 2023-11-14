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

const ACR_ROLES = environment.appRoles;

function forAppCode(appCode: number, roles: Array<string>) {
  return roles.map(name => ({
    appCode,
    name
  }));
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
            path: 'people',
            data: {breadcrumb: 'People'},
            component: PeopleComponent
          },
          {
            path: 'scans',
            data: {breadcrumb: 'Scan'},
            component: ScansComponent
          }
        ]
      }
    ]
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
