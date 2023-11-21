import {Component, OnInit} from '@angular/core';
import {WsComponent} from "@worldskills/worldskills-angular-lib";
import {ActivatedRoute, Router} from "@angular/router";
import {PersonAccreditationService} from "../../services/person-accreditation/person-accreditation.service";
import {Event} from "../../types/event";
import {AppService} from "../../services/app/app.service";
import {combineLatest} from "rxjs";
import {PersonAccreditation} from "../../types/person-accreditation";

@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.css']
})
export class PersonComponent extends WsComponent implements OnInit {

  selectedEvent: Event;
  personAcr: PersonAccreditation;

  constructor(private appService: AppService,
              private router: Router,
              private route: ActivatedRoute,
              private personAccreditationService: PersonAccreditationService
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
          })
        );
      });
  }
}
