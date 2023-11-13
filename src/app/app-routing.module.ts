import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {environment} from "../environments/environment";
import {ErrorComponent} from "./error/error.component";
import {EventsComponent} from "./events/events.component";
import {GuardService} from "@worldskills/worldskills-angular-lib";
import {HomeComponent} from "./home/home.component";

const env = environment;
const ACR_ROLES = env.appRoles;

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
    children: [
      {
        path: '',
        pathMatch: 'full',
        canActivate: [GuardService],
        data: {roles: forAppCode(environment.worldskillsAppId, [ACR_ROLES.ADMIN, ACR_ROLES.EDIT, ACR_ROLES.EDIT_DELEGATE_TYPES, ACR_ROLES.EDIT_POSITIONS, ACR_ROLES.EDIT_ZONES, ACR_ROLES.PRINT])},
        component: EventsComponent
      },
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
