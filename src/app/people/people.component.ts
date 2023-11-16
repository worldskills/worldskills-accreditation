import {Component, OnInit} from '@angular/core';
import {GenericUtil, WsComponent} from "@worldskills/worldskills-angular-lib";
import {PersonAccreditationService} from "../../services/person-accreditation/person-accreditation.service";
import {AppService} from "../../services/app/app.service";
import {
  PersonAccreditationSummaryContainer,
  PersonAccreditationSummaryReqParams
} from "../../types/person-accreditation-summary";
import {Event} from "../../types/event";

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.css']
})
export class PeopleComponent extends WsComponent implements OnInit {

  selectedEvent: Event;
  fetchParams: PersonAccreditationSummaryReqParams;
  result: PersonAccreditationSummaryContainer;
  loading = false;

  constructor(private appService: AppService,
              private personAcrService: PersonAccreditationService) {
    super();
  }

  ngOnInit(): void {
    this.resetFilter();
    this.subscribe(
      this.appService.selectedEvent.subscribe(event => {
        this.selectedEvent = event;
        this.loadPeople();
      })
    );
  }

  private loadPeople() {
    this.loading = true;
    this.personAcrService.getAccreditations(this.selectedEvent.id, this.fetchParams).subscribe(res => {
      this.result = res;
      this.loading = false;
    })
  }

  resetFilter(): void {
    this.fetchParams = {
      name: null,
      country: null,
      member: null,
      pos_id: null,
      pos_name: null,
      skill: null,
      group: null,
      zone: [],
      printed: null,
      photo: null,
      del_types: [],
      offset: 0,
      limit: 10
    }
  }

  sort(field: string) {
    // let sort;
    // if (!this.fetchParams.sort) {
    //   sort = `${field}_asc`;
    // } else {
    //   if (this.fetchParams.sort.startsWith(field)) {
    //     sort = this.fetchParams.sort === `${field}_asc` ? `${field}_desc` : `${field}_asc`;
    //   } else {
    //     sort = `${field}_asc`;
    //   }
    // }
    // this.peopleService.fetchParams.next({
    //   ...this.fetchParams,
    //   sort
    // });
  }

  fetch(page: number) {
    if ((this.fetchParams.offset / this.fetchParams.limit) !== (page - 1)) {
      this.fetchParams = {
        ...this.fetchParams,
        limit: this.fetchParams.limit,
        offset: this.fetchParams.limit ? this.fetchParams.limit * (page - 1) : 0,
      };
      this.loadPeople();
    }
  }

  doesResultHasSkill(): boolean {
    return this.result.people.filter(p => !GenericUtil.isNullOrUndefined(p.skill)).length > 0;
  }

  filter(params: PersonAccreditationSummaryReqParams) {
    this.fetchParams = {...params};
    this.loadPeople();
  }
}
