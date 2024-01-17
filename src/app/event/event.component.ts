import {Component, OnInit} from '@angular/core';
import {NgAuthService, UserRoleUtil, WsComponent} from "@worldskills/worldskills-angular-lib";
import {EventService} from "../../services/event/event.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Event} from "../../types/event";
import {AppService} from "../../services/app/app.service";
import {environment} from "../../environments/environment";

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent extends WsComponent implements OnInit {

  env = environment;
  currentEvent: Event;
  tabs = [
    {label: 'People', path: 'people'},
    {label: 'Scans', path: 'scans'},
    {label: 'Delegate Types', path: 'delegate-types'},
    {label: 'Positions', path: 'positions'},
    {label: 'Package Options', path: 'package-options'},
    {label: 'Zones', path: 'zones'},
  ];
  selectedTabIndex = 0;
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
    this.route.params.subscribe(({eventId}) => {
      this.subscribe(
        this.eventService.get(eventId).subscribe(event => {
          this.currentEvent = event;
          this.appService.selectedEvent.next(this.currentEvent);
        })
      );
    });

    // set selected tab based on current route
    const urlSegments = this.router.url.split('/');
    const selectedTabIndex = this.tabs.findIndex(tab => tab.path === urlSegments[3]);
    if (selectedTabIndex !== -1) {
      this.selectedTabIndex = selectedTabIndex;
    }

    // load current user and check permissions
    this.subscribe(
      this.authService.currentUser.subscribe(currentUser => {
        this.hasAdHocPrintPermission = UserRoleUtil.userHasRoles(currentUser, environment.worldskillsAppId, environment.appRoles.ADMIN, environment.appRoles.AD_HOC_PRINT);
        this.hasSetUpScanAppPermission = UserRoleUtil.userHasRoles(currentUser, environment.worldskillsAppId, environment.appRoles.ADMIN, environment.appRoles.SET_UP_SCAN_APP);
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
