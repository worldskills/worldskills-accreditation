import {Component, OnInit} from '@angular/core';
import {WsComponent} from "@worldskills/worldskills-angular-lib";
import {ActivatedRoute, Router} from "@angular/router";
import {PersonAccreditationService} from "../../services/person-accreditation/person-accreditation.service";
import {Event} from "../../types/event";
import {AppService} from "../../services/app/app.service";
import {combineLatest} from "rxjs";
import {PersonAccreditation} from "../../types/person-accreditation";
import {environment} from "../../environments/environment";
import {DelegateType} from "../../types/delegate-type";
import {DelegateTypeService} from "../../services/delegate-type/delegate-type.service";
import {BadgeTemplateService} from "../../services/badge-template/badge-template.service";

@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.css']
})
export class PersonComponent extends WsComponent implements OnInit {

  readonly peopleURL = environment.worldskillsPeople;
  selectedEvent: Event;
  personAcr: PersonAccreditation;
  delegateTypes: DelegateType[];
  badgeHTMLTemplate: string;

  constructor(private appService: AppService,
              private router: Router,
              private route: ActivatedRoute,
              private personAccreditationService: PersonAccreditationService,
              private delegateTypeService: DelegateTypeService,
              private badgeTemplateService: BadgeTemplateService
  ) {
    super();
  }

  ngOnInit(): void {
    combineLatest([this.appService.selectedEvent, this.route.params])
      .subscribe(([event, {personAcrId}]) => {
        this.selectedEvent = event;
        this.subscribe(
          this.personAccreditationService.getPersonAccreditation(this.selectedEvent.id, personAcrId).subscribe(person => {
            this.personAcr = person;
          }),
          this.delegateTypeService.getList(this.selectedEvent.id).subscribe(res => {
            this.delegateTypes = res.delegate_types;
          }),
          this.badgeTemplateService.getBadgeHTMLTemplate().subscribe(html => {
            this.badgeHTMLTemplate = html;
          })
        );
      });
  }
}
