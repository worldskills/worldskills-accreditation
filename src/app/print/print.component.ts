import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {WsComponent} from "@worldskills/worldskills-angular-lib";
import {AppService} from "../../services/app/app.service";
import {HttpClient} from "@angular/common/http";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {PersonAccreditationSummary} from "../../types/person-accreditation-summary";
import {Event} from "../../types/event";
import {EventService} from "../../services/event/event.service";
import {ActivatedRoute} from "@angular/router";
import {DatePipe} from "@angular/common";
import {TranslateService} from "@ngx-translate/core";

enum BADGE_REPLACEMENT_KEYS {
  PERSON_FIRST_NAME = "PERSON_FIRST_NAME",
  PERSON_LAST_NAME = "PERSON_LAST_NAME",
  LINE_1 = "LINE_1",
  LINE_2 = "LINE_2",
  QR_CODE = "QR_CODE",
  PERSON_IMAGE_THUMBNAIL = "PERSON_IMAGE_THUMBNAIL",
  DELEGATE_TYPE_NAME = "DELEGATE_TYPE_NAME",
  DELEGATE_TYPE_COLOR = "DELEGATE_TYPE_COLOR",
  DELEGATE_TYPE_TEXT_COLOR = "DELEGATE_TYPE_TEXT_COLOR",
  EVENT_NAME = "EVENT_NAME",
  EVENT_START_DATE = "EVENT_START_DATE",
  EVENT_END_DATE = "EVENT_END_DATE",
  DISCLAIMER = "DISCLAIMER",
  CURRENT_DATE = "CURRENT_DATE",
  GENERATED_ON = "GENERATED_ON",
}

@Component({
  selector: 'app-print',
  templateUrl: './print.component.html',
  styleUrls: ['./print.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class PrintComponent extends WsComponent implements OnInit {

  currentEvent: Event;
  people: PersonAccreditationSummary[];
  badgeHTMLTemplate: string;

  constructor(private eventService: EventService,
              private route: ActivatedRoute,
              private appService: AppService,
              private sanitizer: DomSanitizer,
              private translate: TranslateService,
              private httpClient: HttpClient) {
    super();
  }

  ngOnInit(): void {
    // remove header, footer, breadcrumb, etc
    this.appService.showWSLayout.next(false);

    // fetch event
    this.route.params.subscribe(({eventId}) => {
      this.subscribe(
        this.eventService.get(eventId).subscribe(event => {
          this.currentEvent = event;
          this.appService.selectedEvent.next(this.currentEvent);
        })
      );
    });

    // fetch badge template
    this.fetchExternalHtml();
  }

  fetchExternalHtml(): void {
    this.httpClient.get('assets/badge-templates/wsi-2023-ga/wsi-2023-ga.html', {responseType: 'text'})
      .subscribe(html => {
        this.badgeHTMLTemplate = html;
      });
  }

  replaceBadgeContent(person: PersonAccreditationSummary): SafeHtml {
    let badgeHTML = this.badgeHTMLTemplate;

    badgeHTML = badgeHTML.replace(BADGE_REPLACEMENT_KEYS.PERSON_FIRST_NAME, person.first_name);
    badgeHTML = badgeHTML.replace(BADGE_REPLACEMENT_KEYS.PERSON_LAST_NAME, person.last_name);
    badgeHTML = badgeHTML.replace(BADGE_REPLACEMENT_KEYS.LINE_1, person.lines[0]);
    badgeHTML = badgeHTML.replace(BADGE_REPLACEMENT_KEYS.LINE_2, person.lines[1]);
    badgeHTML = badgeHTML.replace(BADGE_REPLACEMENT_KEYS.QR_CODE, person.qr_code);
    badgeHTML = badgeHTML.replace(BADGE_REPLACEMENT_KEYS.PERSON_IMAGE_THUMBNAIL, person.image.thumbnail);
    badgeHTML = badgeHTML.replace(BADGE_REPLACEMENT_KEYS.DELEGATE_TYPE_COLOR, person.delegate_type.color);
    badgeHTML = badgeHTML.replace(BADGE_REPLACEMENT_KEYS.DELEGATE_TYPE_TEXT_COLOR, person.delegate_type.text_color);
    badgeHTML = badgeHTML.replace(BADGE_REPLACEMENT_KEYS.DELEGATE_TYPE_NAME, person.delegate_type.name);
    badgeHTML = badgeHTML.replace(BADGE_REPLACEMENT_KEYS.EVENT_NAME, this.currentEvent.name.text);
    badgeHTML = badgeHTML.replace(BADGE_REPLACEMENT_KEYS.DISCLAIMER, this.translate.instant('accreditation_badge_disclaimer_info'));

    const datepipe = new DatePipe('en-US');
    badgeHTML = badgeHTML.replace(BADGE_REPLACEMENT_KEYS.CURRENT_DATE, datepipe.transform(new Date(), 'dd.MM.yyyy HH:mm'));
    badgeHTML = badgeHTML.replace(BADGE_REPLACEMENT_KEYS.EVENT_START_DATE, datepipe.transform(this.currentEvent.start_date, 'dd.MM.yyyy'));
    badgeHTML = badgeHTML.replace(BADGE_REPLACEMENT_KEYS.EVENT_END_DATE, datepipe.transform(this.currentEvent.end_date, 'dd.MM.yyyy'));
    badgeHTML = badgeHTML.replace(BADGE_REPLACEMENT_KEYS.GENERATED_ON, this.translate.instant('generated_on'));

    return this.sanitizer.bypassSecurityTrustHtml(badgeHTML);
  }
}
