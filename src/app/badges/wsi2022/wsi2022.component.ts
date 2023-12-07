import {Component, Input} from '@angular/core';
import {PersonAccreditationSummary} from "../../../types/person-accreditation-summary";

@Component({
  selector: 'badge-wsi2022',
  templateUrl: './wsi2022.component.html',
  styleUrls: ['../../../styles/badge.css']
})
export class Wsi2022Component {
  @Input() pa: PersonAccreditationSummary;
  currentDate = new Date();
}
