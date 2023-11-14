import {Component, OnInit} from '@angular/core';
import {WsComponent} from "@worldskills/worldskills-angular-lib";
import {PersonAccreditationSummaryReqParams} from "../../types/person-accreditation-summary";

@Component({
  selector: 'app-people-filter',
  templateUrl: './people-filter.component.html',
  styleUrls: ['./people-filter.component.css']
})
export class PeopleFilterComponent extends WsComponent implements OnInit {

  fetchParams: PersonAccreditationSummaryReqParams = {
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
  };

  constructor() {
    super();
  }

  ngOnInit(): void {
  }


}
