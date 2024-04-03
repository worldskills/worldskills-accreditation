import {Component, Input, OnInit} from '@angular/core';
import {WsComponent} from "@worldskills/worldskills-angular-lib";
import {Event} from "../../types/event";
import {Zone} from "../../types/zone";
import {ZoneRequestForm} from "../../types/zone-request/zone-request-form";
import {ZoneRequestAllocation} from "../../types/zone-request/zone-request-allocation";
import {ZoneRequestAllocationService} from "../../services/zone-request-allocation/zone-request-allocation.service";
import {ToastService} from "angular-toastify";
import {PersonAccreditation} from "../../types/person-accreditation";
import {PeopleSearchFunctionalitiesDisplaySetting} from "../people/people.component";

@Component({
  selector: 'app-zone-request-allocation-allocated',
  templateUrl: './zone-request-allocation-allocated.component.html',
  styleUrls: ['./zone-request-allocation-allocated.component.css']
})
export class ZoneRequestAllocationAllocatedComponent extends WsComponent implements OnInit {

  @Input() selectedEvent: Event;
  @Input() zones: Zone[];
  @Input() currentForm: ZoneRequestForm;
  @Input() allocatableZones: Zone[];

  allocations: ZoneRequestAllocation[];
  manualAllocationToZone : Zone;
  functionalitiesDisplaySetting: PeopleSearchFunctionalitiesDisplaySetting = {
    print: false,
    person_profile_visit: false,
    select: false,
  }

  constructor(private zoneReqAllocService: ZoneRequestAllocationService,
              private toastService: ToastService) {
    super();
  }

  ngOnInit() {
    this.loadAllocations();

    // for other components to refresh the list
    this.zoneReqAllocService.refresh.subscribe(() => this.loadAllocations());
  }

  private loadAllocations() {
    this.subscribe(
      this.zoneReqAllocService.getAllocationsForForm(this.selectedEvent.id, this.currentForm.id).subscribe(res => {
        this.allocations = res.allocations;
      })
    );
  }

  getAllocationsForZone(zone: Zone): ZoneRequestAllocation[] {
    const allocations = this.allocations?.filter(allocation => allocation.allocated_zone.id === zone.id);
    if (allocations) {
      return allocations.sort((a, b) => a.zone_request.person_accreditation.organization_name.localeCompare(b.zone_request.person_accreditation.organization_name));
    }
    return [];
  }

  getWristbandDistributedCount(): number {
    return this.allocations?.filter(allocation => allocation.wristband_distributed_at !== null)?.length ?? 0;
  }

  getEmailNotificationSentCount(): number {
    return this.allocations?.filter(allocation => allocation.notification_sent_at !== null)?.length ?? 0;
  }

  updateWristband(isDistributed: boolean, zoneReqAllocId: number) {
    this.zoneReqAllocService.updateWristbandDistribution(this.selectedEvent.id, zoneReqAllocId, !isDistributed).subscribe(() => {
      this.toastService.success(!isDistributed ? 'Wristband marked as distributed!' : 'Wristband distribution removed');
      this.loadAllocations();
    });
  }

  allocate(pa: PersonAccreditation, zone: Zone) {

  }
}
