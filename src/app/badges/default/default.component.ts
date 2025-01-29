import {Component, Input} from '@angular/core';
import {PersonAccreditationSummary} from "../../../types/person-accreditation-summary";
import {Event} from "../../../types/event";

@Component({
  selector: 'badge-default',
  templateUrl: './default.component.html',
  styleUrls: ['../../../styles/badge.css'],
  standalone: false
})
export class DefaultComponent {
  @Input() pa: PersonAccreditationSummary;
  @Input() currentEvent: Event
  currentDate = new Date();
}
