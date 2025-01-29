import {Component, OnInit} from '@angular/core';
import {WsComponent} from "@worldskills/worldskills-angular-lib";
import {AppService} from "../../services/app/app.service";
import {EventService} from "../../services/event/event.service";
import {Event, EventConfig} from "../../types/event";

@Component({
  selector: 'app-setup-scan-app',
  templateUrl: './setup-scan-app.component.html',
  styleUrls: ['./setup-scan-app.component.css'],
  standalone: false
})
export class SetupScanAppComponent extends WsComponent implements OnInit {

  selectedEvent: Event;
  eventConfig: EventConfig;

  constructor(private appService: AppService,
              private eventService: EventService) {
    super();
  }

  ngOnInit(): void {
    this.subscribe(
      this.appService.selectedEvent.subscribe(event => {
        this.selectedEvent = event;

        // load event config
        this.eventService.getEventConfig(this.selectedEvent.id).subscribe(res => {
          this.eventConfig = res;
        });
      })
    )
  }

}
