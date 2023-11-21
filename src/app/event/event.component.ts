import {Component, OnInit} from '@angular/core';
import {WsComponent} from "@worldskills/worldskills-angular-lib";
import {EventService} from "../../services/event/event.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Event} from "../../types/event";
import {AppService} from "../../services/app/app.service";

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent extends WsComponent implements OnInit {

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

  constructor(private eventService: EventService,
              private router: Router,
              private route: ActivatedRoute,
              private appService: AppService) {
    super();
  }

  ngOnInit(): void {
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
  }

  navigate(selectedTab: any) {
    this.router.navigate([this.tabs[selectedTab.index].path], {relativeTo: this.route});
  }
}
