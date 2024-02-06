import {Component, OnInit} from '@angular/core';
import {WsComponent} from "@worldskills/worldskills-angular-lib";
import {Event} from "../../types/event";
import {Zone} from "../../types/zone";
import {AppService} from "../../services/app/app.service";
import {ZoneService} from "../../services/zone/zone.service";
import {ZoneRequestForm} from "../../types/zone-request/zone-request-form";
import {ZoneRequestService} from "../../services/zone-request/zone-request.service";
import {ZoneRequest} from "../../types/zone-request/zone-request";
import {ZoneRequestFormZone} from "../../types/zone-request/zone-request-form-zone";
import {ZoneRequestAllocation} from "../../types/zone-request/ZoneRequestAllocation";

@Component({
  selector: 'app-zone-request-allocation',
  templateUrl: './zone-request-allocation.component.html',
  styleUrls: ['./zone-request-allocation.component.css']
})
export class ZoneRequestAllocationComponent extends WsComponent implements OnInit {

  selectedEvent: Event;
  zones: Zone[];
  loading = false;
  zoneReqForm: ZoneRequestForm;
  zoneRequests: ZoneRequest[];
  organizationNames: string[];
  zoneReqFormZones: ZoneRequestFormZone[];
  allocations: ZoneRequestAllocation[];

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
    //   this.zoneService.getList(this.selectedEvent.id).subscribe(res => {
    //     this.zones = res.zones;
    //     this.loading = false;
    //   })
    // );
    this.zoneRequests = this.zoneReqService.getRequestsForForm(this.zoneReqForm.id);
    this.zoneReqFormZones = this.zoneReqService.getZoneReqMappingForForm(this.zoneReqForm.id);
    this.zones = this.zoneReqService.getZonesForForm(this.zoneReqForm.id);
    this.organizationNames = this.zoneRequests.map(zoneRequest => zoneRequest.person_accreditation.organization.name.text);
    this.allocations = this.zoneReqService.getAllocationsForForm(this.zoneReqForm.id);
  }

  getAllocationsForZone(zone: Zone): ZoneRequestAllocation[] {
    return this.allocations.filter(allocation => allocation.allocated_zone.id === zone.id);
  }

  allocate(zoneRequest: ZoneRequest, zone: Zone) {
    const allocation: ZoneRequestAllocation = {
      id: this.allocations.length + 1,
      zone_request: zoneRequest,
      allocated_zone: zone,
      allocated_at: new Date().toISOString(),
      allocated_by_person_id: 1,
      notification_sent_at: null,
      wristband_distributed_at: null
    };
    this.allocations.push(allocation);
  }
}
