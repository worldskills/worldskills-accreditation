import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {WsComponent} from "@worldskills/worldskills-angular-lib";
import {Event} from "../../types/event";
import {DelegateType} from "../../types/delegate-type";
import {Zone} from "../../types/zone";
import {ZoneService} from "../../services/zone/zone.service";
import {NgForm} from "@angular/forms";

@Component({
  selector: 'app-delegate-types-form',
  templateUrl: './delegate-types-form.component.html',
  styleUrls: ['./delegate-types-form.component.css']
})
export class DelegateTypesFormComponent extends WsComponent implements OnInit {

  @Output() saveDelType: EventEmitter<DelegateType> = new EventEmitter<DelegateType>();
  @Output() cancelForm: EventEmitter<void> = new EventEmitter<void>();
  @Input() delType: DelegateType;
  @Input() selectedEvent: Event;
  @ViewChild('form') form: NgForm;
  zones: Zone[];

  constructor(private zoneService: ZoneService) {
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
    this.saveDelType.emit({...this.delType, ...this.form.value});
  }

  cancel() {
    this.cancelForm.emit();
  }
}
