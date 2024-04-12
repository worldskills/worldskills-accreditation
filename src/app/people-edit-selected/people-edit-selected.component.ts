import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { DelegateTypeService } from '../../services/delegate-type/delegate-type.service';
import { ZoneService } from '../../services/zone/zone.service';
import { DelegateType } from '../../types/delegate-type';
import { Zone } from '../../types/zone';
import { Event } from '../../types/event';
import { PersonAccreditationService } from '../../services/person-accreditation/person-accreditation.service';
import { ToastService } from 'angular-toastify';

@Component({
  selector: 'app-people-edit-selected',
  templateUrl: './people-edit-selected.component.html',
  styleUrls: ['./people-edit-selected.component.css']
})
export class PeopleEditSelectedComponent {

  @Input() selectedEvent: Event;
  @Input() selectedPeople: any[];
  @Output() close: EventEmitter<void> = new EventEmitter<void>();
  @Output() saved: EventEmitter<void> = new EventEmitter<void>();

  delegateTypes: DelegateType[];
  zones: Zone[];

  @ViewChild('form') form: NgForm;

  delegateType: DelegateType;
  addZones: Zone[] = [];
  removeZones: Zone[] = [];

  constructor(
    private toastService: ToastService,
    private delegateTypeService: DelegateTypeService,
    private zoneService: ZoneService,
    private personAccreditationService: PersonAccreditationService,
  ) {
  }

  ngOnInit(): void {
      this.delegateTypeService.getList(this.selectedEvent.id).subscribe(res => {
        this.delegateTypes = res.delegate_types;
      });
      this.zoneService.getList(this.selectedEvent.id).subscribe(res => {
        this.zones = res.zones;
      });
  }

  save() {
    this.personAccreditationService.batchUpdateAccreditations(this.selectedEvent.id, this.selectedPeople.map(a => a.id), this.form.value['delegateType'], this.form.value['addZones'], this.form.value['removeZones']).subscribe(res => {
      this.toastService.success('Accreditations updated');
      this.form.resetForm();
      this.saved.emit();
    }, err => {
      this.toastService.error('Error updating accreditations: ' + (err.error.user_msg || 'Unknown error'));
    });
  }

  cancel() {
    this.close.emit();
  }
}
