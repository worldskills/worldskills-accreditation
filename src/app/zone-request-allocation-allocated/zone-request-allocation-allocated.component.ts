import {Component, Input, OnInit} from '@angular/core';
import {WsComponent} from "@worldskills/worldskills-angular-lib";
import {Event} from "../../types/event";
import {Zone} from "../../types/zone";
import {ZoneRequestForm} from "../../types/zone-request/zone-request-form";
import {ZoneRequestAllocation} from "../../types/zone-request/zone-request-allocation";
import {ZoneRequestAllocationService} from "../../services/zone-request-allocation/zone-request-allocation.service";
import {ToastService} from "angular-toastify";
import {PeopleSearchFunctionalitiesDisplaySetting} from "../people/people.component";
import {PersonAccreditationSummary} from "../../types/person-accreditation-summary";
import {ZoneRequestFormZone} from "../../types/zone-request/zone-request-form-zone";

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
  @Input() allocatableFormZones: ZoneRequestFormZone[];

  allocations: ZoneRequestAllocation[];
  previewSelectedPersonACR: PersonAccreditationSummary = null;

  // for manual allocation to a zone
  manualAllocationToZone: Zone = null;
  functionalitiesDisplaySetting: PeopleSearchFunctionalitiesDisplaySetting = {
    print: false,
    person_profile_visit: false,
    select_a_person: true,
  }
  manualAllocationToPerson: PersonAccreditationSummary = null;

  // for filtering allocations
  filterZone: Zone;

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

  /**
   * Filter the allocatable zones by the selected zone
   */
  filterAllocatableZones(formZones: ZoneRequestFormZone[]): ZoneRequestFormZone[] {
    if (this.filterZone) {
      return formZones.filter(zrfz => zrfz.zone.id === this.filterZone.id);
    }
    return formZones;
  }

  /**
   * Get the allocations for a zone
   */
  getAllocationsForZone(zone: Zone): ZoneRequestAllocation[] {
    const allocations = this.allocations?.filter(allocation => allocation.allocated_zone.id === zone.id);
    if (allocations) {
      return allocations.sort((a, b) => {
        if (a.allocated_zone_spot_label != null && b.allocated_zone_spot_label != null) {
          return a.allocated_zone_spot_label.localeCompare(b.allocated_zone_spot_label);
        } else if (a.zone_request != null && b.zone_request != null) {
          return a.zone_request.person_accreditation.person_position.organization.name.text.localeCompare(b.zone_request.person_accreditation.person_position.organization.name.text);
        } else if (a.manual_allocation_to_person_accreditation != null && b.manual_allocation_to_person_accreditation != null) {
          return (a.manual_allocation_to_person_accreditation?.organization ?? '').localeCompare(b.manual_allocation_to_person_accreditation?.organization ?? '');
        } else {
          return 0;
        }
      });
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
    this.zoneReqAllocService.updateWristbandDistribution(this.selectedEvent.id, zoneReqAllocId, !isDistributed).subscribe({
      next: () => {
        this.toastService.success(!isDistributed ? 'Wristband marked as distributed!' : 'Wristband distribution removed');
        this.loadAllocations();
      },
      error: (err) => {
        this.toastService.error(err?.error?.user_msg ?? 'Error updating wristband distribution');
      }
    });
  }

  /**
   * Manual allocation of PersonAccreditation to a zone (without a request)
   */
  allocate(pas: PersonAccreditationSummary, zone: Zone) {
    const cleaningUp = (): void => {
      this.manualAllocationToZone = null;
      this.manualAllocationToPerson = null;
    }

    this.zoneReqAllocService.allocatePersonACRToZone(this.selectedEvent.id, this.currentForm.id, zone.id, pas).subscribe({
      next: () => {
        this.toastService.success('Person allocated to zone');
        this.loadAllocations();
        cleaningUp();
      },
      error: (err) => {
        this.toastService.error(err?.error?.user_msg ?? 'Error allocating person to zone');
        cleaningUp();
      }
    });
  }

  selectedPerson(pas: PersonAccreditationSummary) {
    this.manualAllocationToPerson = pas;
  }

  trackByAllocId(idx: number, zra: ZoneRequestAllocation) {
    return zra.id;
  }

  sendOutstandingNotifEmails(): void {
    if (confirm('Are you sure you want to send the emails to them now?')) {
      this.zoneReqAllocService.sendZoneAllocatedPendingNotificationEmails(this.selectedEvent.id, this.currentForm.id).subscribe({
        next: () => {
          this.toastService.success('Sending emails...');
          this.loadAllocations();
        },
        error: (err) => {
          this.toastService.error(err?.error?.user_msg ?? 'Error sending emails');
        }
      });
    }
  }
}
