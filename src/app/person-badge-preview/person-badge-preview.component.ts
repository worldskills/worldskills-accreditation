import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {PersonAccreditationSummary} from "../../types/person-accreditation-summary";
import {WsComponent} from "@worldskills/worldskills-angular-lib";
import {Event} from "../../types/event";

/**
 * PersonBadgePreviewComponent is used to display the preview of the badge for a person. It'll have a "preview" watermark on it.
 */
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
