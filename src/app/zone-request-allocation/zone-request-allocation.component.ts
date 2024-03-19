import {Component, OnInit} from '@angular/core';
import {GenericUtil, WsComponent} from "@worldskills/worldskills-angular-lib";
import {Event} from "../../types/event";
import {Zone} from "../../types/zone";
import {AppService} from "../../services/app/app.service";
import {ZoneService} from "../../services/zone/zone.service";
import {ZoneRequestForm} from "../../types/zone-request/zone-request-form";
import {ZoneRequestService} from "../../services/zone-request/zone-request.service";
import {ZoneRequest} from "../../types/zone-request/zone-request";
import {ZoneRequestFormZone} from "../../types/zone-request/zone-request-form-zone";
import {ZoneRequestAllocation} from "../../types/zone-request/ZoneRequestAllocation";
import {combineLatest} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {ZoneRequestFormService} from "../../services/zone-request-form/zone-request-form.service";

@Component({
  selector: 'app-zone-request-allocation',
  templateUrl: './zone-request-allocation.component.html',
  styleUrls: ['./zone-request-allocation.component.css']
})
export class ZoneRequestAllocationComponent extends WsComponent implements OnInit {

  selectedEvent: Event;
  loading = false;
  zones: Zone[];
  currentForm: ZoneRequestForm;

  allocatableZones: Zone[];

  // allocations
  zoneReqFormZones: ZoneRequestFormZone[]; // TODO: revisit, do we need this?
  allocations: ZoneRequestAllocation[];

  constructor(private appService: AppService,
              private zoneService: ZoneService,
              private route: ActivatedRoute,
              private zoneReqFormService: ZoneRequestFormService,
              ) {
    super();
  }

  ngOnInit(): void {
    this.appService.showMenuTabs.next(false);

    combineLatest([this.appService.selectedEvent, this.route.params])
      .subscribe(([event, {zoneRequestFormHash}]) => {
        this.selectedEvent = event;

        this.subscribe(
          // load zones
          this.zoneService.getList(this.selectedEvent.id).subscribe(res => {
            this.zones = res.zones;
          }),
          // load ZoneRequestForm
          this.zoneReqFormService.getZoneReqForm(this.selectedEvent.id, zoneRequestFormHash).subscribe(zoneReqForm => {
            this.currentForm = zoneReqForm;
            this.zoneReqFormZones = this.currentForm.zones;
            this.allocatableZones = this.currentForm.zones.filter(zone => zone.available_for_allocation).map(z => z.zone);
          }),
        )
      });
  }


  getAllocationsForZone(zone: Zone): ZoneRequestAllocation[] {
    return this.allocations?.filter(allocation => allocation.allocated_zone.id === zone.id) ?? [];
  }
}
