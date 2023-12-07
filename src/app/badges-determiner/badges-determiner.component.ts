import {Component, Input} from '@angular/core';
import {PersonAccreditationSummary} from "../../types/person-accreditation-summary";
import {Event} from "../../types/event";

@Component({
  selector: 'app-badges-determiner',
  templateUrl: './badges-determiner.component.html',
  styleUrls: ['./badges-determiner.component.css']
})
export class BadgesDeterminerComponent {
  @Input() pa: PersonAccreditationSummary;
  @Input() currentEvent: Event;
}
