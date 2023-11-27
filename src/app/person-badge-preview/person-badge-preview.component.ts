import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {PersonAccreditationSummary} from "../../types/person-accreditation-summary";
import {SafeHtml} from "@angular/platform-browser";
import {WsComponent} from "@worldskills/worldskills-angular-lib";
import {BadgeTemplateService} from "../../services/badge-template/badge-template.service";
import {Event} from "../../types/event";

@Component({
  selector: 'app-person-badge-preview',
  templateUrl: './person-badge-preview.component.html',
  styleUrls: ['./person-badge-preview.component.css', '../../styles/badge.css'],
  encapsulation: ViewEncapsulation.None
})
export class PersonBadgePreviewComponent extends WsComponent implements OnInit {

  @Input() selectedEvent: Event;
  @Input() badgeHTMLTemplate: string;
  @Input() person: PersonAccreditationSummary;

  constructor(private badgeTemplateService: BadgeTemplateService) {
    super();
  }

  ngOnInit() {
  }

  replaceBadgeContent(person: PersonAccreditationSummary): SafeHtml {
    return this.badgeTemplateService.replaceBadgeContent(this.badgeHTMLTemplate, person, this.selectedEvent);
  }
}
