import {Component, OnInit} from '@angular/core';
import {NgAuthService, UserRoleUtil, WsComponent} from "@worldskills/worldskills-angular-lib";
import {EventService} from "../../services/event/event.service";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {Event} from "../../types/event";
import {AppService} from "../../services/app/app.service";
import {environment} from "../../environments/environment";

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent extends WsComponent implements OnInit {

  private env = environment;
  private appRoles = this.env.appRoles;
  appId = environment.worldskillsAppId;
  currentEvent: Event;
  tabs = [
    {label: 'People', path: 'people', requiredRoles: [this.appRoles.ADMIN, this.appRoles.EDIT, this.appRoles.PRINT]},
    {label: 'Vehicles', path: 'vehicles', requiredRoles: [this.appRoles.ADMIN, this.appRoles.EDIT_VEHICLES]},
    {label: 'Scans', path: 'scans', requiredRoles: [this.appRoles.ADMIN]},
    {label: 'Delegate Types', path: 'delegate-types', requiredRoles: [this.appRoles.ADMIN, this.appRoles.EDIT_DELEGATE_TYPES]},
    {label: 'Positions', path: 'positions', requiredRoles: [this.appRoles.ADMIN, this.appRoles.EDIT_POSITIONS]},
    {label: 'Package Options', path: 'package-options', requiredRoles: [this.appRoles.ADMIN, this.appRoles.EDIT_PACKAGE_OPTIONS]},
    {label: 'Zones', path: 'zones', requiredRoles: [this.appRoles.ADMIN, this.appRoles.EDIT_ZONES]},
    {label: 'Zone Request Form', path: 'zone-request-form', requiredRoles: [this.appRoles.ADMIN, this.appRoles.ALLOCATE_ZONE_REQUEST]},
  ];
  selectedTabIndex = 0;
  showEventNameHeader = true;
  showMenuTabs = true;
  setupScanApp: boolean;
  hasAdHocPrintPermission = false;
  hasSetUpScanAppPermission = false;

  constructor(private eventService: EventService,
              private router: Router,
              private route: ActivatedRoute,
              private authService: NgAuthService,
              private appService: AppService) {
    super();
  }

  ngOnInit(): void {
    this.appService.showMenuTabs.subscribe(showMenuTabs => setTimeout(() => (this.showMenuTabs = showMenuTabs)));
    this.appService.showEventNameHeader.subscribe(showEventNameHeader => setTimeout(() => (this.showEventNameHeader = showEventNameHeader)));
    this.route.params.subscribe(({eventId}) => {
      this.subscribe(
        this.eventService.get(eventId).subscribe(event => {
          this.currentEvent = event;
          this.appService.selectedEvent.next(this.currentEvent);
        })
      );
    });

    // load current user and check permissions
    this.subscribe(
      this.authService.currentUser.subscribe(currentUser => {
        this.hasAdHocPrintPermission = UserRoleUtil.userHasRoles(currentUser, environment.worldskillsAppId, environment.appRoles.ADMIN, environment.appRoles.AD_HOC_PRINT);
        this.hasSetUpScanAppPermission = UserRoleUtil.userHasRoles(currentUser, environment.worldskillsAppId, environment.appRoles.ADMIN, environment.appRoles.SET_UP_SCAN_APP);

        // hide tabs that user does not have permission to access
        this.tabs = this.tabs.filter(tab => {
          return tab.requiredRoles.some(role => UserRoleUtil.userHasRoles(currentUser, environment.worldskillsAppId, role));
        });

        this.router.events.subscribe((event) => {
          // set selected tab based on current route
          if (event instanceof NavigationEnd) {
            const urlSegments = event.url.split('/');
            const selectedTabIndex = this.tabs.findIndex(tab => tab.path === urlSegments[3]);
            if (selectedTabIndex !== -1) {
              this.selectedTabIndex = selectedTabIndex;
            }
          }
        });

      })
    )
  }

  navigate(selectedTab: any): void {
    this.router.navigate([this.tabs[selectedTab.index].path], {relativeTo: this.route});
  }

  openAdHocPrinting(): void {
    const urlTree = this.router.createUrlTree(['print'],
      {relativeTo: this.route, queryParams: {adhocPrinting: true}});
    const url = this.router.serializeUrl(urlTree);
    window.open(url, '_blank');
  }
}
