import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {GenericUtil, WsComponent} from "@worldskills/worldskills-angular-lib";
import {Event} from "../../types/event";
import {ZoneRequestForm} from "../../types/zone-request/zone-request-form";
import {NgForm} from "@angular/forms";
import {Zone} from "../../types/zone";
import {ZoneService} from "../../services/zone/zone.service";
import {ZoneRequestFormZone} from "../../types/zone-request/zone-request-form-zone";
import {ToastService} from "angular-toastify";

@Component({
  selector: 'app-zone-request-form-form',
  templateUrl: './zone-request-form-form.component.html',
  styleUrls: ['./zone-request-form-form.component.css'],
  standalone: false
})
export class ZoneRequestFormFormComponent extends WsComponent implements OnInit {

  @Output() saveZoneReqForm: EventEmitter<ZoneRequestForm> = new EventEmitter<ZoneRequestForm>();
  @Output() cancelForm: EventEmitter<void> = new EventEmitter<void>();
  @Input() zoneReqForm: ZoneRequestForm;
  @Input() selectedEvent: Event;
  @ViewChild('form') form: NgForm;
  zones: Zone[];
  manageZoneReqFormZone: ZoneRequestFormZone = {
    quota: null,
    available_for_request: false,
    available_for_allocation: false
  };

  constructor(private zoneService: ZoneService,
              private toastService: ToastService) {
    super();
  }

  ngOnInit(): void {
    this.subscribe(
      this.zoneService.getList(this.selectedEvent.id).subscribe(res => {
        this.zones = res.zones;
      })
    );
  }

  save(): void {
    if (this.form.valid) {
      if (this.zoneReqForm.zones.length === 0) {
        this.toastService.error("At least one zone is required");
        return;
      }

      this.zoneReqForm.name = {
        lang_code: 'en',
        text: this.form.value.name
      };
      this.zoneReqForm.header_text = {
        lang_code: 'en',
        text: this.form.value.header_text
      };
      this.zoneReqForm.open_for_request = this.form.value.open_for_request;
      this.saveZoneReqForm.emit(this.zoneReqForm);
    }
  }

  cancel() {
    this.cancelForm.emit();
  }

  removeZoneFormZone(i: number) {
    this.zoneReqForm.zones.splice(i, 1);
  }

  addZoneFormZone() {
    if (GenericUtil.isNullOrUndefined(this.manageZoneReqFormZone.zone) ||
      GenericUtil.isNullOrUndefined(this.manageZoneReqFormZone.quota)) {
      this.toastService.error("Please select a zone and enter a quota");
      return;
    }

    this.zoneReqForm.zones.push({...this.manageZoneReqFormZone});
    this.manageZoneReqFormZone = {
      quota: null,
      available_for_request: false,
      available_for_allocation: false
    };
  }
}
