import {Component, Input, OnInit} from '@angular/core';
import {GenericUtil, WsComponent} from "@worldskills/worldskills-angular-lib";
import {Event} from "../../types/event";
import {Zone} from "../../types/zone";
import {ZoneRequestForm} from "../../types/zone-request/zone-request-form";
import {ZoneRequest} from "../../types/zone-request/zone-request";
import {ZoneRequestService} from "../../services/zone-request/zone-request.service";
import {ZoneRequestAllocationService} from "../../services/zone-request-allocation/zone-request-allocation.service";
import {ToastService} from "angular-toastify";
import * as moment from "moment/moment";

@Component({
  selector: 'app-zone-request-allocation-pending',
  templateUrl: './zone-request-allocation-pending.component.html',
  styleUrls: ['./zone-request-allocation-pending.component.css']
})
export class ZoneRequestAllocationPendingComponent extends WsComponent implements OnInit {

  @Input() selectedEvent: Event;
  @Input() zones: Zone[];
  @Input() currentForm: ZoneRequestForm;
  @Input() allocatableZones: Zone[];

  pendingRequests: ZoneRequest[];
  pendingReqsSorting: 'org-asc' | 'org-desc' | 'name-asc' | 'name-desc' | 'first-choice-asc' | 'first-choice-desc' | 'second-choice-asc' | 'second-choice-desc';
  // for filtering pending requests
  pendingReqOrgNames: string[] = [];
  pendingReqOrgName: string;
  pendingReqZones: Zone[] = [];
  pendingReqZone: Zone;

  actionState = {
    allocate: false,
    deny: false,
    exportRequests: false
  }

  constructor(private zoneReqService: ZoneRequestService,
              private zoneReqAllocService: ZoneRequestAllocationService,
              private toastService: ToastService) {
    super();
  }

  ngOnInit(): void {
    this.loadRequests();

    // for other components to refresh the list
    this.zoneReqService.refresh.subscribe(() => this.loadRequests());
  }

  public loadRequests() {
    this.subscribe(
      this.zoneReqService.getRequests(this.selectedEvent.id, this.currentForm.id).subscribe(res => {
        // load pending requests from API
        this.pendingRequests = res.zone_requests;

        // filter pending requests by Zone and/or Org name
        if (!GenericUtil.isNullOrUndefined(this.pendingReqOrgName)) {
          this.pendingRequests = this.pendingRequests.filter(req => req.person_accreditation?.person_position.organizational_unit === this.pendingReqOrgName);
        }
        if (!GenericUtil.isNullOrUndefined(this.pendingReqZone)) {
          this.pendingRequests = this.pendingRequests.filter(req => req.first_choice_zone.id === this.pendingReqZone.id || req.second_choice_zone?.id === this.pendingReqZone.id);
        }

        // sort pending requests by organization name (default)
        this.sortPendingRequests('org-asc');

        // get unique org names from pending requests for filters
        this.pendingReqOrgNames = [];
        [...(new Set(this.pendingRequests.map(req => req.person_accreditation.person_position.organizational_unit).filter(ou => !GenericUtil.isNullOrUndefined(ou))))].forEach(ou => {
          this.pendingReqOrgNames.push(ou);
        });

        // get unique zones from pending requests for filters
        this.pendingReqZones = [];
        [...(new Set(this.pendingRequests.map(req => req.first_choice_zone.id)))].forEach(zoneId => {
          this.pendingReqZones.push(this.zones.find(zone => zone.id === zoneId));
        });
      })
    )
  }

  public sortPendingRequests(sorting: string): ZoneRequest[] {
    this.pendingReqsSorting = sorting as any;

    return this.pendingRequests.sort((a, b) => {
      try {
        switch (sorting) {
          case "org-asc":
            return a.person_accreditation.person_position.organizational_unit.localeCompare(b.person_accreditation.person_position.organizational_unit);
          case "org-desc":
            return b.person_accreditation.person_position.organizational_unit.localeCompare(a.person_accreditation.person_position.organizational_unit);
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

  allocate(zoneRequest: ZoneRequest, zone: Zone) {
    if (GenericUtil.isNullOrUndefined(zone)) {
      this.toastService.error('Please select a Zone to allocate the request!');
      return;
    }

    this.actionState.allocate = true;
    this.zoneReqAllocService.allocateRequestToZone(this.selectedEvent.id, zoneRequest.zone_request_form.id, zone.id, zoneRequest).subscribe(res => {
      this.toastService.success('Request allocated to a Zone successfully!');
      // refresh the pending requests list
      this.loadRequests();
      // refresh the allocated requests list
      this.zoneReqAllocService.refresh.next(true);
      this.actionState.allocate = false;
    }, err => {
      this.toastService.error(err.error.user_msg ?? 'Failed to allocate request to a Zone!');
      this.actionState.allocate = false;
    });
  }

  deny(zoneRequest: ZoneRequest): void {
    if (confirm('Are you sure to deny this request?')) {
      this.actionState.deny = true;
      this.zoneReqAllocService.denyRequest(this.selectedEvent.id, zoneRequest).subscribe({
        next: () => {
          this.toastService.success('Request is denied!');
          // refresh the pending requests list
          this.loadRequests();
          this.actionState.deny = false;
        }, error: (err) => {
          this.toastService.error(err?.error?.user_msg ?? 'Error denying the request');
          this.actionState.deny = false;
        }
      })
    }
  }

  exportZoneRequests(): void {
    this.actionState.exportRequests = true;
    // export to file
    this.zoneReqService.exportZoneRequests(this.selectedEvent.id, this.currentForm.id)
      .subscribe(response => {
        const objectURL = window.URL.createObjectURL(new Blob([response], {type: 'application/octet-stream'}));
        const downloadLink = document.createElement('a');
        downloadLink.href = objectURL;
        downloadLink.setAttribute('download', `${this.selectedEvent.name.text}_${this.currentForm.name.text}_zone_requests_${moment().format("yyyyMMDDHHmmss")}.xlsx`);
        document.body.appendChild(downloadLink);
        downloadLink.click();

        this.actionState.exportRequests = false;
      }, error => {
        this.actionState.exportRequests = false;
        this.toastService.error('Failed to export Zone Requests');
      });
  }

  trackByPendingReqId(idx: number, zr: ZoneRequest): number {
    return zr.id;
  }
}
