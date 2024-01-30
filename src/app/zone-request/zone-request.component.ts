import {Component, OnInit} from '@angular/core';
import {WsComponent} from "@worldskills/worldskills-angular-lib";
import {Zone} from "../../types/zone";
import {ZoneService} from "../../services/zone/zone.service";
import {AppService} from "../../services/app/app.service";
import {Event} from "../../types/event";

@Component({
  selector: 'app-zone-request',
  templateUrl: './zone-request.component.html',
  styleUrls: ['./zone-request.component.css']
})
export class ZoneRequestComponent extends WsComponent implements OnInit {

  selectedEvent: Event;
  zones: Zone[];
  loading = false;

  constructor(private appService: AppService,
              private zoneService: ZoneService) {
    super();
  }

  ngOnInit(): void {
    this.appService.showMenuTabs.next(false);
    this.subscribe(
      this.appService.selectedEvent.subscribe(event => {
        this.selectedEvent = event;

        // load zones for selected event
        this.loadData();
      })
    )
  }

  private loadData() {
    this.loading = true;
    this.subscribe(
      this.zoneService.getList(this.selectedEvent.id).subscribe(res => {
        this.zones = res.zones;
        this.loading = false;
      })
    );
  }

  submit(): void {

  }
}
