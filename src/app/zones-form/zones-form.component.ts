import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {WsComponent} from "@worldskills/worldskills-angular-lib";
import {Event} from "../../types/event";
import {NgForm} from "@angular/forms";
import {Zone} from "../../types/zone";

@Component({
  selector: 'app-zones-form',
  templateUrl: './zones-form.component.html',
  styleUrls: ['./zones-form.component.css']
})
export class ZonesFormComponent extends WsComponent implements OnInit {

  @Output() saveZone: EventEmitter<Zone> = new EventEmitter<Zone>();
  @Output() cancelForm: EventEmitter<void> = new EventEmitter<void>();
  @Input() zone: Zone;
  @Input() selectedEvent: Event;
  @ViewChild('form') form: NgForm;
  color = '#0084ad';

  constructor() {
    super();
  }

  ngOnInit(): void {
    if (this.zone.color) {
      this.color = this.zone.color;
    }
  }

  save(): void {
    this.saveZone.emit({...this.zone, ...this.form.value});
  }

  cancel() {
    this.cancelForm.emit();
  }
}
