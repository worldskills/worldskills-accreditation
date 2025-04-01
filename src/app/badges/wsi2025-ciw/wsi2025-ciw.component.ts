import {Component, Input} from '@angular/core';
import {PersonAccreditationSummary} from "../../../types/person-accreditation-summary";
import {Event} from "../../../types/event";

@Component({
  selector: 'badge-wsi2025-ciw',
  templateUrl: './wsi2025-ciw.component.html',
  styleUrls: ['../../../styles/badge.css'],
  standalone: false
})
export class Wsi2025CiwComponent {
  @Input() pa: PersonAccreditationSummary;
  @Input() currentEvent: Event
  currentDate = new Date();
}
