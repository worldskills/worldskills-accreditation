import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {GenericUtil, WsComponent} from "@worldskills/worldskills-angular-lib";
import {AppService} from "../../services/app/app.service";
import {DomSanitizer} from "@angular/platform-browser";
import {
  PersonAccreditationSummary,
  PersonAccreditationSummaryReqParams
} from "../../types/person-accreditation-summary";
import {Event} from "../../types/event";
import {EventService} from "../../services/event/event.service";
import {ActivatedRoute} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";
import {PersonAccreditationService} from "../../services/person-accreditation/person-accreditation.service";


@Component({
  selector: 'app-print',
  templateUrl: './print.component.html',
  styleUrls: ['../../styles/badge.css', './print.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class PrintComponent extends WsComponent implements OnInit {

  selectedEvent: Event;
  fetchParams: PersonAccreditationSummaryReqParams;
  people: PersonAccreditationSummary[] = [];
  loading = false;
  twoBadgesPerPage: boolean;

  adhocPrinting: boolean;
  showAdhocPrintingForm: boolean;

  constructor(private eventService: EventService,
              private route: ActivatedRoute,
              private appService: AppService,
              private sanitizer: DomSanitizer,
              private translate: TranslateService,
              private personAcrService: PersonAccreditationService) {
    super();
  }

  ngOnInit(): void {
    // remove header, footer, breadcrumb, etc
    this.appService.showWSLayout.next(false);

    this.fetchParams = this.personAcrService.initialiseFetchParams();

    // fetch event
    this.route.params.subscribe(({eventId, personAcrId}) => {
      this.subscribe(
        this.eventService.get(eventId).subscribe(event => {
          this.selectedEvent = event;
          this.appService.selectedEvent.next(this.selectedEvent);

          if (!GenericUtil.isNullOrUndefined(personAcrId)) {
            this.loadPerson(personAcrId);
          } else {
            // fetch people from query params
            this.route.queryParams.subscribe(params => {
              if ('adhocPrinting' in params && !GenericUtil.isNullOrUndefined(params['adhocPrinting'])) {
                this.adhocPrinting = params['adhocPrinting'] === 'true';
                this.showAdhocPrintingForm = this.adhocPrinting;
              } else {
                this.personAcrService.loadFilterFromQueryParams(params, this.fetchParams);
                if ('twoBadgesPerPage' in params && !GenericUtil.isNullOrUndefined(params['twoBadgesPerPage'])) {
                  this.twoBadgesPerPage = params['twoBadgesPerPage'] === 'true';
                }
                this.loadPeople();
              }
            });
          }
        })
      );
    });
  }

  private loadPeople() {
    this.loading = true;
    this.personAcrService.getAccreditations(this.selectedEvent.id, this.fetchParams).subscribe(res => {
      this.people = res.people.filter(p => this.personAcrService.canBePrinted(this.selectedEvent, p));
      this.loading = false;
    })
  }

  private loadPerson(personAcrId: number) {
    this.loading = true;
    this.personAcrService.getPersonAccreditation(this.selectedEvent.id, personAcrId).subscribe(res => {
      this.people = [res.summary].filter(p => this.personAcrService.canBePrinted(this.selectedEvent, p));
      this.loading = false;
    })
  }

  openBrowserPrintPreview(): void {
    window.onbeforeprint = () => {
      if (!this.adhocPrinting) {
        this.people.map(p => p.id).forEach(personAcrId => {
          this.personAcrService.markAsPrinted(this.selectedEvent.id, personAcrId).subscribe();
        });
      }
    }
    window.print();
  }

  showAdHocForm() {
    this.showAdhocPrintingForm = true;
  }

  saveAdHocPeople(people: PersonAccreditationSummary[]): void {
    this.people = people;
  }
}
