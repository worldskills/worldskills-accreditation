import {Component, Input} from '@angular/core';
import {PersonAccreditationSummary} from "../../../types/person-accreditation-summary";
import {Event} from "../../../types/event";

@Component({
  selector: 'badge-wsi2023-ciw',
  templateUrl: './wsi2023-ciw.component.html',
  styleUrls: ['../../../styles/badge.css'],
  standalone: false
})
export class Wsi2023CiwComponent {
  @Input() pa: PersonAccreditationSummary;
  @Input() currentEvent: Event
  currentDate = new Date();
}
