import {Component, OnInit} from '@angular/core';
import {NgAuthService, UserRoleUtil, WsComponent} from "@worldskills/worldskills-angular-lib";
import {ActivatedRoute, Router} from "@angular/router";
import {environment} from "../../environments/environment";

@Component({
  selector: 'app-event-index',
  template: '',
  standalone: false
})
export class EventIndexComponent extends WsComponent implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: NgAuthService,
  ) {
    super();
  }

  ngOnInit(): void {

    // load current user and check permissions
    this.subscribe(
      this.authService.currentUser.subscribe(currentUser => {
        const hasEditPermission = UserRoleUtil.userHasRoles(currentUser, environment.worldskillsAppId, environment.appRoles.ADMIN, environment.appRoles.EDIT);
        const hasPrintPermission = UserRoleUtil.userHasRoles(currentUser, environment.worldskillsAppId, environment.appRoles.ADMIN, environment.appRoles.PRINT);
        const hasAllocateZoneRequestPermission = UserRoleUtil.userHasRoles(currentUser, environment.worldskillsAppId, environment.appRoles.ADMIN, environment.appRoles.ALLOCATE_ZONE_REQUEST);
        const hasViewAccreditationsPermission = UserRoleUtil.userHasRoles(currentUser, environment.worldskillsAppId, environment.appRoles.ADMIN, environment.appRoles.VIEW_ACCREDITATIONS);

        if (hasEditPermission || hasPrintPermission || hasViewAccreditationsPermission) {
          this.router.navigate(['people'], {relativeTo: this.route});
        } else if(hasAllocateZoneRequestPermission){
          this.router.navigate(['zone-request-form'], {relativeTo: this.route});
        } else {
          // TODO: to consider having it in event.component.ts? - #SleepyForNow
          // this.router.navigate([''], {relativeTo: this.route});
        }
      })
    )
  }
}
