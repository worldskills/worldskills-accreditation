import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {GenericUtil, WsComponent} from "@worldskills/worldskills-angular-lib";
import {Event} from "../../types/event";
import {Zone} from "../../types/zone";
import {ZoneRequestForm} from "../../types/zone-request/zone-request-form";
import {ZoneRequestAllocation} from "../../types/zone-request/zone-request-allocation";
import {ZoneRequestAllocationService} from "../../services/zone-request-allocation/zone-request-allocation.service";
import {ToastService} from "angular-toastify";
import {PeopleSearchFunctionalitiesDisplaySetting} from "../people/people.component";
import {PersonAccreditationSummary} from "../../types/person-accreditation-summary";
import {ZoneRequestFormZone} from "../../types/zone-request/zone-request-form-zone";
import {Person} from "../../types/person";
import {NgForm} from "@angular/forms";
import {
  ZoneRequestFormPositionService
} from "../../services/zone-request-form-position/zone-request-form-position.service";
import {
  ZoneRequestFormPosition,
  ZoneRequestFormPositionType
} from "../../types/zone-request/zone-request-form-position";
import {ZoneRequestService} from "../../services/zone-request/zone-request.service";
import * as moment from "moment";

@Component({
  selector: 'app-zone-request-allocation-allocated',
  templateUrl: './zone-request-allocation-allocated.component.html',
  styleUrls: ['./zone-request-allocation-allocated.component.css'],
  standalone: false
})
export class ZoneRequestAllocationAllocatedComponent extends WsComponent implements OnInit {

  @Input() selectedEvent: Event;
  @Input() zones: Zone[];
  @Input() currentForm: ZoneRequestForm;
  @Input() allocatableZones: Zone[];
  @Input() allocatableFormZones: ZoneRequestFormZone[];
  @ViewChild('newPersonForm') newPersonForm: NgForm;

  allocations: ZoneRequestAllocation[];
  previewSelectedPersonACR: PersonAccreditationSummary = null;

  // for manual allocation to a zone
  manualAllocationMode: 'SELECT_EXISTING_PERSON' | 'CREATE_NEW_PERSON' = null;
  manualAllocationToZone: Zone = null;
  functionalitiesDisplaySetting: PeopleSearchFunctionalitiesDisplaySetting = {
    print: false,
    person_profile_visit: false,
    select_a_person: true,
  }
  manualAllocationToPerson: PersonAccreditationSummary = null;
  manualAllocationAssignablePositions: ZoneRequestFormPosition[] = [];

  // for filtering allocations
  filterZones: number[];
  filterPersonName: string;

  actionState = {
    wristband_distribution: false,
    move_up_down: false,
    direct_edit_order: false,
    undo_allocation: false,
    export_allocations: false,
  }

  constructor(private zoneReqAllocService: ZoneRequestAllocationService,
              private zoneReqFormPositionService: ZoneRequestFormPositionService,
              private zoneReqService: ZoneRequestService,
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
      }),
      this.zoneReqFormPositionService.getPositions(this.selectedEvent.id, this.currentForm.id, ZoneRequestFormPositionType.NEW_PERSON_MANUAL_ALLOCATION).subscribe(res => {
        this.manualAllocationAssignablePositions = res.positions;
      })
    );
  }

  /**
   * Filter the allocatable zones by the selected zone
   */
  filterAllocatableZones(formZones: ZoneRequestFormZone[]): ZoneRequestFormZone[] {
    if (this.filterZones && this.filterZones.length > 0) {
      return formZones.filter(zrfz => this.filterZones.includes(zrfz.zone.id));
    }
    return formZones;
  }

  /**
   * Get the allocations for a zone
   */
  getAllocationsForZone(zone: Zone): ZoneRequestAllocation[] {
    let allocations = this.allocations?.filter(allocation => allocation.allocated_zone.id === zone.id);
    if (allocations) {
      // filter by person name
      if (!GenericUtil.isNullOrUndefined(this.filterPersonName)) {
        allocations = allocations.filter(allocation => {
          const person = !GenericUtil.isNullOrUndefined(allocation.zone_request) ? allocation.zone_request.person_accreditation.person : allocation.manual_allocation_to_person_accreditation.person;
          return (person.first_name + ' ' + person.last_name).toLowerCase().includes(this.filterPersonName.toLowerCase());
        });
      }

      // sort by zone spot label, then by organization name, then by organizational unit
      return allocations.sort((a, b) => {
        if (a.allocated_zone_spot_label != null && b.allocated_zone_spot_label != null) {
          return a.allocated_zone_spot_label > b.allocated_zone_spot_label ? 1 : -1;
        } else if (a.zone_request != null && b.zone_request != null) {
          return a.zone_request.person_accreditation.person_position.organization.name.text.localeCompare(b.zone_request.person_accreditation.person_position.organization.name.text);
        } else if (a.manual_allocation_to_person_accreditation != null && b.manual_allocation_to_person_accreditation != null) {
          return (a.manual_allocation_to_person_accreditation?.person_position.organizational_unit ?? '').localeCompare(b.manual_allocation_to_person_accreditation?.person_position.organizational_unit ?? '');
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

  updateWristband(isDistributed: boolean, zoneReqAllocId: number): void {
    this.actionState.wristband_distribution = true;
    this.zoneReqAllocService.updateWristbandDistribution(this.selectedEvent.id, zoneReqAllocId, !isDistributed).subscribe({
      next: () => {
        this.toastService.success(!isDistributed ? 'AccessID marked as distributed!' : 'AccessID distribution removed');
        this.loadAllocations();
        this.actionState.wristband_distribution = false;
      },
      error: (err) => {
        this.toastService.error(err?.error?.user_msg ?? 'Error updating AccessID distribution');
        this.actionState.wristband_distribution = false;
      }
    });
  }

  private cleaningUpManualAllocation(): void {
    this.manualAllocationToZone = null;
    this.manualAllocationToPerson = null;
    this.manualAllocationMode = null;
  }

  /**
   * Manual allocation of PersonAccreditation to a zone (without a request)
   */
  allocate(pas: PersonAccreditationSummary, zone: Zone) {
    this.zoneReqAllocService.allocatePersonACRToZone(this.selectedEvent.id, this.currentForm.id, zone.id, pas).subscribe({
      next: () => {
        this.toastService.success('Person allocated to zone');
        this.loadAllocations();
        this.cleaningUpManualAllocation();
      },
      error: (err) => {
        this.toastService.error(err?.error?.user_msg ?? 'Error allocating person to zone');
        this.cleaningUpManualAllocation();
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

  undoAllocation(allocation: ZoneRequestAllocation): void {
    if (confirm('Are you sure to undo the allocation for this person?')) {
      const notify = confirm('Do you want to send email notification to the person?');

      this.actionState.undo_allocation = true;
      this.zoneReqAllocService.undoAllocation(this.selectedEvent.id, allocation.id, notify).subscribe({
        next: () => {
          this.toastService.success('Allocation is successfully undo');
          this.loadAllocations();
          // refresh the pending requests list
          this.zoneReqService.refresh.next(true);
          this.actionState.undo_allocation = false;
        },
        error: (err) => {
          this.toastService.error(err?.error?.user_msg ?? 'Error undo allocation');
          this.actionState.undo_allocation = false;
        }
      });
    }
  }

  move(allocation: ZoneRequestAllocation, direction: 'UP' | 'DOWN'): void {
    this.actionState.move_up_down = true;
    this.zoneReqAllocService.updateOrder(this.selectedEvent.id, allocation.id, allocation.version, direction).subscribe({
      next: () => {
        this.toastService.success('Allocation order is updated');
        this.loadAllocations();
        this.actionState.move_up_down = false;
      },
      error: (err) => {
        this.toastService.error(err?.error?.user_msg ?? 'Error moving allocation');
        this.actionState.move_up_down = false;
      }
    });
  }

  saveNewPerson(): void {
    if (this.newPersonForm.valid) {
      const person: Person = {
        first_name: this.newPersonForm.value.first_name,
        last_name: this.newPersonForm.value.last_name,
        email_address: this.newPersonForm.value.email_address,
        positions: [
          {
            organizational_unit: this.newPersonForm.value.organizational_unit,
            position: this.newPersonForm.value.zoneReqFormPosition.position,
            id: null,
            start: null,
            end: null,
            invalid: null,
            open_field: null,
            skill: null,
            sector: null,
            member: null,
            organization: null,
          }
        ],
        id: null,
        country: null,
        images: null,
      };

      this.zoneReqAllocService.allocateNewPersonToZone(this.selectedEvent.id, this.currentForm.id, this.manualAllocationToZone.id,
        person).subscribe({
        next: () => {
          this.toastService.success('New person allocated to zone');
          this.loadAllocations();
          this.cleaningUpManualAllocation();
        },
        error: (err) => {
          this.toastService.error(err?.error?.user_msg ?? 'Error allocating new person to zone');
        }
      });
    } else {
      this.toastService.error('Please fill all required fields');
    }
  }

  updateSpotLabel(changeState: any, allocation: ZoneRequestAllocation): void {
    this.actionState.direct_edit_order = true;
    this.zoneReqAllocService.directEditOrder(this.selectedEvent.id, allocation.id, allocation.version, {
      spot_label: changeState.target.value
    }).subscribe({
      next: () => {
        this.toastService.success('Allocation spot label is updated');
        this.loadAllocations();
        this.actionState.direct_edit_order = false;
      },
      error: (err) => {
        this.toastService.error(err?.error?.user_msg ?? 'Error editing spot label');
        this.actionState.direct_edit_order = false;

        // update the text field back to its original value
        changeState.target.value = allocation.allocated_zone_spot_label;
      }
    });
  }

  exportZoneAllocations(): void {
    this.actionState.export_allocations = true;
    // export to file
    this.zoneReqAllocService.exportZoneAllocations(this.selectedEvent.id, this.currentForm.id)
      .subscribe(response => {
        const objectURL = window.URL.createObjectURL(new Blob([response], {type: 'application/octet-stream'}));
        const downloadLink = document.createElement('a');
        downloadLink.href = objectURL;
        downloadLink.setAttribute('download', `${this.selectedEvent.name.text}_${this.currentForm.name.text}_zone_allocations_${moment().format("yyyyMMDDHHmmss")}.xlsx`);
        document.body.appendChild(downloadLink);
        downloadLink.click();

        this.actionState.export_allocations = false;
      }, error => {
        this.actionState.export_allocations = false;
        this.toastService.error('Failed to export Zone Allocations');
      });
  }
}
