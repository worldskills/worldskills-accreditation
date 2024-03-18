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
  zones: Zone[];
  currentForm: ZoneRequestForm;

  // pending requests
  pendingReqOrgNames: string[] = [];
  pendingReqZones: Zone[] = [];
  pendingRequests: ZoneRequest[];
  allocatableZones: Zone[];
  pendingRequestsSorting: 'org-asc' | 'org-desc' | 'name-asc' | 'name-desc' | 'first-choice-asc' | 'first-choice-desc' | 'second-choice-asc' | 'second-choice-desc';

  // allocations
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
          // load zones
          this.zoneService.getList(this.selectedEvent.id).subscribe(res => {
            this.zones = res.zones;
          }),
          // load ZoneRequestForm
          this.zoneReqFormService.getZoneReqForm(this.selectedEvent.id, zoneRequestFormHash).subscribe(zoneReqForm => {
            this.currentForm = zoneReqForm;
            this.allocatableZones = this.currentForm.zones.filter(zone => zone.available_for_allocation).map(z => z.zone);

            // load ZoneRequest for current form
            this.loadRequests();
          }),
        )
      });
  }

  private loadRequests() {
    this.subscribe(
      this.zoneReqService.getRequests(this.selectedEvent.id, this.currentForm.id).subscribe(res => {
        // load pending requests from API and sort them
        this.pendingRequests = res.zone_requests;
        this.sortPendingRequests('org-asc');

        // get unique org names from pending requests for filters
        this.pendingReqOrgNames = [...(new Set(res.zone_requests.map(req => req.person_accreditation.organization_name)))];

        // get unique zones from pending requests for filters
        this.pendingReqZones = [];
        [...(new Set(res.zone_requests.map(req => req.first_choice_zone.id)))].forEach(zoneId => {
          this.pendingReqZones.push(this.zones.find(zone => zone.id === zoneId));
        });
      })
    )
  }

  public sortPendingRequests(sorting: string): ZoneRequest[] {
    this.pendingRequestsSorting = sorting as any;

    return this.pendingRequests.sort((a, b) => {
      try {
        switch (sorting) {
          case "org-asc":
            return a.person_accreditation.organization_name.localeCompare(b.person_accreditation.organization_name);
          case "org-desc":
            return b.person_accreditation.organization_name.localeCompare(a.person_accreditation.organization_name);
          case "name-asc":
            return a.person_accreditation.person.first_name.localeCompare(b.person_accreditation.person.first_name);
          case "name-desc":
            return b.person_accreditation.person.first_name.localeCompare(a.person_accreditation.person.first_name);
          case "first-choice-asc":
            return a.first_choice_zone.name.localeCompare(b.first_choice_zone.name);
          case "first-choice-desc":
            return b.first_choice_zone.name.localeCompare(a.first_choice_zone.name);
          case "second-choice-asc":
            return a.second_choice_zone?.name.localeCompare(b.second_choice_zone?.name);
          case "second-choice-desc":
            return b.second_choice_zone?.name.localeCompare(a.second_choice_zone?.name);
          default:
            return 0;
        }
      } catch (e) {
        return 0;
      }
    });
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
