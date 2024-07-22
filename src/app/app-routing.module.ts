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
import { VehiclesComponent } from './vehicles/vehicles.component';
import { VehicleAddComponent } from './vehicle-add/vehicle-add.component';
import { VehicleComponent } from './vehicle/vehicle.component';
import { VehiclePrintComponent } from './vehicle-print/vehicle-print.component';
import { EventIndexComponent } from './event-index/event-index.component';
import {ZoneRequestComponent} from "./zone-request/zone-request.component";
import {ZoneRequestAllocationComponent} from "./zone-request-allocation/zone-request-allocation.component";
import {ZoneRequestedComponent} from "./zone-requested/zone-requested.component";
import {ZoneRequestFormComponent} from "./zone-request-form/zone-request-form.component";
import {
  ZoneRequestAllocationFinderComponent
} from "./zone-request-allocation-finder/zone-request-allocation-finder.component";

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
    path: 'events/:eventId/vehicles/print',
    data: {
      roles: forAppCode(environment.worldskillsAppId, [ACR_ROLES.ADMIN, ACR_ROLES.PRINT_VEHICLES])
    },
    canActivate: [GuardService],
    component: VehiclePrintComponent,
  },
  {
    path: 'events',
    canActivate: [GuardService],
    data: {
      roles: forAppCode(environment.worldskillsAppId, [ACR_ROLES.ADMIN, ACR_ROLES.EDIT, ACR_ROLES.UPLOAD_PHOTO, ACR_ROLES.EDIT_DELEGATE_TYPES, ACR_ROLES.EDIT_POSITIONS, ACR_ROLES.EDIT_ZONES, ACR_ROLES.PRINT, ACR_ROLES.EDIT_VEHICLES, ACR_ROLES.PRINT_VEHICLES])
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
        title: 'WorldSkills Accreditation',
        children: [
          {
            path: '',
            pathMatch: 'full',
            component: EventIndexComponent
          },
          {
            path: 'zone-request-form',
            data: {
              breadcrumb: 'Zone Request Form',
              roles: forAppCode(environment.worldskillsAppId, [ACR_ROLES.ADMIN, ACR_ROLES.ALLOCATE_ZONE_REQUEST])
            },
            title: getTitle('Zone Request Form'),
            canActivate: [GuardService],
            component: ZoneRequestFormComponent
          },
          {
            path: 'zone-request-form/:zoneRequestFormHash',
            data: {
              breadcrumb: 'Zone Request Form',
              roles: forAppCode(environment.worldskillsAppId, [ACR_ROLES.ADMIN, ACR_ROLES.REQUEST_ZONE, ACR_ROLES.ALLOCATE_ZONE_REQUEST])
            },
            title: getTitle('Request Zone'),
            canActivate: [GuardService],
            component: ZoneRequestComponent
          },
          {
            path: 'zone-request-form/:zoneRequestFormHash/zone-requests/:zoneReqId',
            data: {
              breadcrumb: 'Zone Request',
              roles: forAppCode(environment.worldskillsAppId, [ACR_ROLES.ADMIN, ACR_ROLES.REQUEST_ZONE, ACR_ROLES.ALLOCATE_ZONE_REQUEST])
            },
            title: getTitle('Request Zone'),
            canActivate: [GuardService],
            component: ZoneRequestedComponent
          },
          {
            path: 'zone-request-form/:zoneRequestFormHash/allocate',
            data: {
              breadcrumb: 'Zone Request Allocation',
              roles: forAppCode(environment.worldskillsAppId, [ACR_ROLES.ADMIN, ACR_ROLES.ALLOCATE_ZONE_REQUEST])
            },
            title: getTitle('Zone Request Allocation'),
            canActivate: [GuardService],
            component: ZoneRequestAllocationComponent
          },
          {
            path: 'zone-request-form/:zoneRequestFormHash/finder-verify',
            data: {
              breadcrumb: 'Zone Request Allocation Finder and Verify',
              roles: forAppCode(environment.worldskillsAppId, [ACR_ROLES.ADMIN, ACR_ROLES.ALLOCATE_ZONE_REQUEST, ACR_ROLES.VERIFY_ALLOCATION])
            },
            title: getTitle('Zone Request Allocation Finder and Verify'),
            canActivate: [GuardService],
            component: ZoneRequestAllocationFinderComponent
          },
          {
            path: 'people',
            data: {breadcrumb: 'People'},
            component: PeopleComponent
          },
          {
            path: 'people/:personAcrId',
            data: {
              breadcrumb: 'Person',
              roles: forAppCode(environment.worldskillsAppId, [ACR_ROLES.ADMIN, ACR_ROLES.EDIT, ACR_ROLES.UPLOAD_PHOTO, ACR_ROLES.PRINT])
            },
            canActivate: [GuardService],
            component: PersonComponent
          },
          {
            path: 'vehicles',
            data: {
              breadcrumb: 'Vehicles',
              roles: forAppCode(environment.worldskillsAppId, [ACR_ROLES.ADMIN, ACR_ROLES.EDIT_VEHICLES])
            },
            canActivate: [GuardService],
            component: VehiclesComponent
          },
          {
            path: 'vehicles/add',
            data: {
              breadcrumb: 'Add Vehicle',
              roles: forAppCode(environment.worldskillsAppId, [ACR_ROLES.ADMIN, ACR_ROLES.EDIT_VEHICLES])
            },
            canActivate: [GuardService],
            component: VehicleAddComponent
          },
          {
            path: 'vehicles/:vehicleAcrId',
            data: {
              breadcrumb: 'Vehicle',
              roles: forAppCode(environment.worldskillsAppId, [ACR_ROLES.ADMIN, ACR_ROLES.EDIT_VEHICLES])
            },
            canActivate: [GuardService],
            component: VehicleComponent
          },
          {
            path: 'scans',
            data: {
              breadcrumb: 'Scan',
              roles: forAppCode(environment.worldskillsAppId, [ACR_ROLES.ADMIN])
            },
            canActivate: [GuardService],
            component: ScansComponent
          },
          {
            path: 'delegate-types',
            data: {
              breadcrumb: 'Delegate Types',
              roles: forAppCode(environment.worldskillsAppId, [ACR_ROLES.ADMIN, ACR_ROLES.EDIT_DELEGATE_TYPES])
            },
            canActivate: [GuardService],
            component: DelegateTypesComponent
          },
          {
            path: 'positions',
            data: {
              breadcrumb: 'Positions',
              roles: forAppCode(environment.worldskillsAppId, [ACR_ROLES.ADMIN, ACR_ROLES.EDIT_POSITIONS])
            },
            canActivate: [GuardService],
            component: PositionsComponent
          },
          {
            path: 'package-options',
            data: {
              breadcrumb: 'Package Options',
              roles: forAppCode(environment.worldskillsAppId, [ACR_ROLES.ADMIN, ACR_ROLES.EDIT_PACKAGE_OPTIONS])
            },
            canActivate: [GuardService],
            component: PackageOptionsComponent
          },
          {
            path: 'zones',
            data: {
              breadcrumb: 'Zones',
              roles: forAppCode(environment.worldskillsAppId, [ACR_ROLES.ADMIN, ACR_ROLES.EDIT_ZONES])
            },
            canActivate: [GuardService],
            component: ZonesComponent
          }
        ]
      }
    ]
  },
  {
    path: 'events/:eventId/print',
    data: {
      roles: forAppCode(environment.worldskillsAppId, [ACR_ROLES.ADMIN, ACR_ROLES.PRINT])
    },
    canActivate: [GuardService],
    component: PrintComponent,
  },
  {
    path: 'events/:eventId/print/:personAcrId',
    data: {
      roles: forAppCode(environment.worldskillsAppId, [ACR_ROLES.ADMIN, ACR_ROLES.PRINT])
    },
    canActivate: [GuardService],
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
