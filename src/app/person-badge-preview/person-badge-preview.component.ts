import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {PersonAccreditationSummary} from "../../types/person-accreditation-summary";
import {WsComponent} from "@worldskills/worldskills-angular-lib";
import {Event} from "../../types/event";

@Component({
  selector: 'app-person-badge-preview',
  templateUrl: './person-badge-preview.component.html',
  styleUrls: ['./person-badge-preview.component.css', '../../styles/badge.css'],
  encapsulation: ViewEncapsulation.None
})
export class PersonBadgePreviewComponent extends WsComponent implements OnInit {

  @Input() selectedEvent: Event;
  @Input() person: PersonAccreditationSummary;

  constructor() {
    super();
  }

  ngOnInit() {
  }
}
