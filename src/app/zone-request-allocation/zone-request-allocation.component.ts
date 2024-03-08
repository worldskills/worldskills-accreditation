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
  zoneReqForm: ZoneRequestForm;
  zoneRequests: ZoneRequest[];
  allocatableZones: Zone[];

  zones: Zone[];
  organizationNames: string[];
  zoneReqFormZones: ZoneRequestFormZone[];
  allocations: ZoneRequestAllocation[];

  constructor(private appService: AppService,
              private zoneService: ZoneService,
              private route: ActivatedRoute,
              private zoneReqFormService: ZoneRequestFormService,
              private zoneReqService: ZoneRequestService) {
    super();
  }

  ngOnInit(): void {
    this.appService.showMenuTabs.next(false);

    combineLatest([this.appService.selectedEvent, this.route.params])
      .subscribe(([event, {zoneRequestFormHash}]) => {
        this.selectedEvent = event;

        this.subscribe(
          // load ZoneRequestForm
          this.zoneReqFormService.getZoneReqForm(this.selectedEvent.id, zoneRequestFormHash).subscribe(zoneReqForm => {
            this.zoneReqForm = zoneReqForm;
            this.allocatableZones = this.zoneReqForm.zones.filter(zone => zone.available_for_allocation).map(z => z.zone);

            this.zoneReqService.getRequests(this.selectedEvent.id, this.zoneReqForm.id).subscribe(res => {
              this.zoneRequests = res.zone_requests;
              console.log(res);
            })
          }),
        )
      });
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
