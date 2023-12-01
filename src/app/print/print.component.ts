import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {WsComponent} from "@worldskills/worldskills-angular-lib";
import {AppService} from "../../services/app/app.service";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {
  PersonAccreditationSummary,
  PersonAccreditationSummaryReqParams
} from "../../types/person-accreditation-summary";
import {Event} from "../../types/event";
import {EventService} from "../../services/event/event.service";
import {ActivatedRoute, Params} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";
import {BadgeTemplateService} from "../../services/badge-template/badge-template.service";
import {PersonAccreditationService} from "../../services/person-accreditation/person-accreditation.service";


@Component({
  selector: 'app-print',
  templateUrl: './print.component.html',
  styleUrls: ['../../styles/badge.css'],
  encapsulation: ViewEncapsulation.None
})
export class PrintComponent extends WsComponent implements OnInit {

  selectedEvent: Event;
  badgeHTMLTemplate: string;
  fetchParams: PersonAccreditationSummaryReqParams;
  people: PersonAccreditationSummary[] = [];
  loading = false;

  constructor(private eventService: EventService,
              private route: ActivatedRoute,
              private appService: AppService,
              private sanitizer: DomSanitizer,
              private translate: TranslateService,
              private personAcrService: PersonAccreditationService,
              private badgeTemplateService: BadgeTemplateService) {
    super();
  }

  ngOnInit(): void {
    // remove header, footer, breadcrumb, etc
    this.appService.showWSLayout.next(false);

    this.fetchParams = this.personAcrService.initialiseFetchParams();

    // fetch badge template
    this.fetchExternalHtml();

    // fetch event
    this.route.params.subscribe(({eventId}) => {
      this.subscribe(
        this.eventService.get(eventId).subscribe(event => {
          this.selectedEvent = event;
          this.appService.selectedEvent.next(this.selectedEvent);

          // fetch people from query params
          this.route.queryParams.subscribe(params => {
            this.personAcrService.loadFilterFromQueryParams(params, this.fetchParams);
            this.loadPeople();
          });
        })
      );
    });
  }

  private loadPeople() {
    this.loading = true;
    this.personAcrService.getAccreditations(this.selectedEvent.id, this.fetchParams).subscribe(res => {
      this.people = res.people;
      this.loading = false;
    })
  }

  fetchExternalHtml(): void {
    this.subscribe(
      this.badgeTemplateService.getBadgeHTMLTemplate().subscribe(html => {
        this.badgeHTMLTemplate = html;
      })
    );
  }

  replaceBadgeContent(person: PersonAccreditationSummary, idx: number): SafeHtml {
    return this.badgeTemplateService.replaceBadgeContent(idx, this.badgeHTMLTemplate, person, this.selectedEvent, false, this.people.length);
  }
}
