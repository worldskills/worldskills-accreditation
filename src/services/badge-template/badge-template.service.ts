import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {WsService} from "@worldskills/worldskills-angular-lib";
import {Observable} from "rxjs";
import {PersonAccreditationSummary} from "../../types/person-accreditation-summary";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {DatePipe} from "@angular/common";
import {Event} from "../../types/event";
import {TranslateService} from "@ngx-translate/core";

export enum BADGE_REPLACEMENT_KEYS {
  PERSON_FIRST_NAME = "PERSON_FIRST_NAME",
  PERSON_LAST_NAME = "PERSON_LAST_NAME",
  LINE_1 = "LINE_1",
  LINE_2 = "LINE_2",
  LINE_3 = "LINE_3",
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

  LOOP_ZONES_TEMPLATE_SELECTOR = "LOOP_ZONES_TEMPLATE_SELECTOR",
  LOOP_ZONES_CONTAINER = "LOOP_ZONES_CONTAINER",
  LOOP_ZONES_CODE = "LOOP_ZONES_CODE",
  LOOP_ZONES_COLOR = "LOOP_ZONES_COLOR",
  LOOP_ZONES_TEXT_COLOR = "LOOP_ZONES_TEXT_COLOR",
}

@Injectable({
  providedIn: 'root'
})
export class BadgeTemplateService extends WsService<any> {

  constructor(private http: HttpClient,
              private sanitizer: DomSanitizer,
              private translate: TranslateService) {
    super();
  }

  getBadgeHTMLTemplate(): Observable<string> {
    return this.http.get('assets/badge-templates/wsi-2022.html', {responseType: 'text'});
  }

  replaceBadgeContent(idx: number,
                      badgeHTMLTemplate: string,
                      person: PersonAccreditationSummary,
                      currentEvent: Event,
                      twoBadgesPerPage: boolean = false,
                      totalBadgesToPrint: number = null): SafeHtml {
    let badgeHTML = badgeHTMLTemplate;

    // replace data for static elements
    badgeHTML = badgeHTML.replace(BADGE_REPLACEMENT_KEYS.PERSON_FIRST_NAME, person.first_name);
    badgeHTML = badgeHTML.replace(BADGE_REPLACEMENT_KEYS.PERSON_LAST_NAME, person.last_name);
    badgeHTML = badgeHTML.replace(BADGE_REPLACEMENT_KEYS.LINE_1, person.lines[0] ?? '');
    badgeHTML = badgeHTML.replace(BADGE_REPLACEMENT_KEYS.LINE_2, person.lines[1] ?? '');
    badgeHTML = badgeHTML.replace(BADGE_REPLACEMENT_KEYS.LINE_3, person.lines.length >= 3 ? (person.lines[2] ?? '') : '');
    badgeHTML = badgeHTML.replace(BADGE_REPLACEMENT_KEYS.QR_CODE, person.qr_code);
    badgeHTML = badgeHTML.replace(BADGE_REPLACEMENT_KEYS.PERSON_IMAGE_THUMBNAIL, person.image.thumbnail);
    badgeHTML = badgeHTML.replace(BADGE_REPLACEMENT_KEYS.DELEGATE_TYPE_COLOR, person.delegate_type.color);
    badgeHTML = badgeHTML.replace(BADGE_REPLACEMENT_KEYS.DELEGATE_TYPE_TEXT_COLOR, person.delegate_type.text_color);
    badgeHTML = badgeHTML.replace(BADGE_REPLACEMENT_KEYS.DELEGATE_TYPE_NAME, person.delegate_type.name);
    badgeHTML = badgeHTML.replace(BADGE_REPLACEMENT_KEYS.EVENT_NAME, currentEvent.name.text);
    badgeHTML = badgeHTML.replace(BADGE_REPLACEMENT_KEYS.DISCLAIMER, this.translate.instant('accreditation_badge_disclaimer_info'));

    const datepipe = new DatePipe('en-US');
    badgeHTML = badgeHTML.replace(BADGE_REPLACEMENT_KEYS.CURRENT_DATE, datepipe.transform(new Date(), 'dd.MM.yyyy HH:mm'));
    badgeHTML = badgeHTML.replace(BADGE_REPLACEMENT_KEYS.EVENT_START_DATE, datepipe.transform(currentEvent.start_date, 'dd.MM.yyyy'));
    badgeHTML = badgeHTML.replace(BADGE_REPLACEMENT_KEYS.EVENT_END_DATE, datepipe.transform(currentEvent.end_date, 'dd.MM.yyyy'));
    badgeHTML = badgeHTML.replace(BADGE_REPLACEMENT_KEYS.GENERATED_ON, this.translate.instant('generated_on'));

    // replace data for dynamic elements
    const loopZonesContainer = this.getDOMObjectFromStringWithParser(badgeHTML, '.' + BADGE_REPLACEMENT_KEYS.LOOP_ZONES_TEMPLATE_SELECTOR);
    const loopZonesTemplate = loopZonesContainer.firstElementChild;
    let zonesContent = '';
    person.zones.forEach(zone => {
      const loopZone = loopZonesTemplate.cloneNode(true) as HTMLElement;
      loopZone.style.backgroundColor = zone.color;
      loopZone.style.color = zone.text_color;
      loopZone.textContent = loopZone.textContent.replace(BADGE_REPLACEMENT_KEYS.LOOP_ZONES_CODE, zone.code);
      zonesContent += loopZone.outerHTML;
    });
    badgeHTML = badgeHTML.replace(BADGE_REPLACEMENT_KEYS.LOOP_ZONES_CONTAINER, zonesContent);



    // check if two badges per page
    if (twoBadgesPerPage) {
      let twoBadgesPerPageClass = "ws-badge-multiple";
      if ((idx + 1) % 2 === 1) {
        twoBadgesPerPageClass += " ws-badge-multiple-odd";
      } else if ((idx + 1) % 2 === 0) {
        twoBadgesPerPageClass += " ws-badge-multiple-even";
        twoBadgesPerPageClass += " ws-badge-multiple-cut-separator";
      }

      // Set full page to last badge if total badges to print is odd
      if (totalBadgesToPrint % 2 === 1 && idx === totalBadgesToPrint - 1) {
        twoBadgesPerPageClass += " ws-badge-multiple-last";
      }

      badgeHTML = badgeHTML.replace("ws-badge", twoBadgesPerPageClass);
    }

    return this.sanitizer.bypassSecurityTrustHtml(badgeHTML);
  }

  getDOMObjectFromStringWithParser(htmlString: string, selector: string): HTMLElement {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    const targetElement = doc.querySelector(selector);
    if (!targetElement) {
      throw new Error(`Element with selector "${selector}" not found`);
    }
    return targetElement as HTMLElement;
  }

}
