import {Component, OnInit} from '@angular/core';
import {WsComponent} from "@worldskills/worldskills-angular-lib";
import {Event} from "../../types/event";
import {AppService} from "../../services/app/app.service";
import {ZoneService} from "../../services/zone/zone.service";
import {Zone} from "../../types/zone";

@Component({
  selector: 'app-zones',
  templateUrl: './zones.component.html',
  styleUrls: ['./zones.component.css']
})
export class ZonesComponent extends WsComponent implements OnInit {

  selectedEvent: Event;
  zones: Zone[];
  loading = false;

  constructor(private appService: AppService,
              private zoneService: ZoneService) {
    super();
  }

  ngOnInit(): void {
    this.subscribe(
      this.appService.selectedEvent.subscribe(event => {
        this.selectedEvent = event;

        // load zones for selected event
        this.loading = true;
        this.zoneService.getZones(this.selectedEvent.id).subscribe(res => {
          this.zones = res.zones;
          this.loading = false;
        });
      })
    )
  }

  moveUp(zone: Zone) {

  }

  moveDown(zone: Zone) {

  }
}
