import {Component, OnInit} from '@angular/core';
import {WsComponent} from "@worldskills/worldskills-angular-lib";
import {Zone} from "../../types/zone";
import {ZoneService} from "../../services/zone/zone.service";
import {AppService} from "../../services/app/app.service";
import {Event} from "../../types/event";
import {ZoneRequestForm} from "../../types/zone-request/zone-request-form";
import {ZoneRequestService} from "../../services/zone-request/zone-request.service";

@Component({
  selector: 'app-zone-request',
  templateUrl: './zone-request.component.html',
  styleUrls: ['./zone-request.component.css']
})
export class ZoneRequestComponent extends WsComponent implements OnInit {

  selectedEvent: Event;
  zones: Zone[];
  loading = false;
  zoneReqForm: ZoneRequestForm;

  constructor(private appService: AppService,
              private zoneService: ZoneService,
              private zoneReqService: ZoneRequestService) {
    super();
  }

  ngOnInit(): void {
    this.appService.showMenuTabs.next(false);
    this.zoneReqForm = this.zoneReqService.zoneReqForm;
    this.subscribe(
      this.appService.selectedEvent.subscribe(event => {
        this.selectedEvent = event;

        // load zones for selected event
        this.loadData();
      })
    )
  }

  private loadData() {
    // this.loading = true;
    // this.subscribe(
      // this.zoneService.getList(this.selectedEvent.id).subscribe(res => {
      //   this.zones = res.zones;
      //   this.loading = false;
      // })
    // );
    this.zones =  this.zoneReqService.getZonesForForm(this.zoneReqForm.id);
  }

  submit(): void {

  }
}
