import {Component, Input} from '@angular/core';
import {PersonAccreditationSummary} from "../../../types/person-accreditation-summary";
import {Event} from "../../../types/event";

@Component({
  selector: 'badge-wsi2024-cpw',
  templateUrl: './wsi2024-cpw.component.html',
  styleUrls: ['./wsi2024-cpw.component.css']
})
export class Wsi2024CpwComponent {
  @Input() pa: PersonAccreditationSummary;
  @Input() currentEvent: Event
  currentDate = new Date();
}
