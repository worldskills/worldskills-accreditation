import {Component, Input} from '@angular/core';
import {PersonAccreditationSummary} from "../../../types/person-accreditation-summary";
import {Event} from "../../../types/event";

@Component({
  selector: 'badge-wsi2023-ga',
  templateUrl: './wsi2023-ga.component.html',
  styleUrls: ['../../../styles/badge.css']
})
export class Wsi2023GaComponent {

  @Input() pa: PersonAccreditationSummary;
  @Input() currentEvent: Event

  @Input() twoBadgesPerPage: boolean;
  @Input() index: number;
  @Input() totalBadgesToPrint: number;

  currentDate = new Date();
}
