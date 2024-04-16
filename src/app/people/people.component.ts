import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {GenericUtil, NgAuthService, UserRoleUtil, WsComponent} from "@worldskills/worldskills-angular-lib";
import {PersonAccreditationService} from "../../services/person-accreditation/person-accreditation.service";
import {AppService} from "../../services/app/app.service";
import {
  PersonAccreditationSummary,
  PersonAccreditationSummaryContainer,
  PersonAccreditationSummaryReqParams
} from "../../types/person-accreditation-summary";
import {Event} from "../../types/event";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {combineLatest} from "rxjs";
import {environment} from "../../environments/environment";

export interface PeopleSearchFunctionalitiesDisplaySetting {
  print: boolean;
  person_profile_visit: boolean;
  select_a_person: boolean;
}

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.css']
})
export class PeopleComponent extends WsComponent implements OnInit {

  @Input() functionalitiesDisplaySetting: PeopleSearchFunctionalitiesDisplaySetting = {
    print: true,
    person_profile_visit: true,
    select_a_person: false,
  }
  @Output() selectedPerson: EventEmitter<PersonAccreditationSummary> = new EventEmitter<PersonAccreditationSummary>();

  allChecked = false;
  selectedEvent: Event;
  fetchParams: PersonAccreditationSummaryReqParams;
  result: PersonAccreditationSummaryContainer;
  loading = false;
  showEditSelectedForm = false;

  hasPrintPermission = false;

  constructor(private appService: AppService,
              private personAcrService: PersonAccreditationService,
              private router: Router,
              private route: ActivatedRoute,
              private authService: NgAuthService) {
    super();
  }

  ngOnInit(): void {
    this.appService.showMenuTabs.next(true);
    this.fetchParams = this.personAcrService.initialiseFetchParams();

    // load current user and check permissions
    this.subscribe(
      this.authService.currentUser.subscribe(currentUser => {
        this.hasPrintPermission = UserRoleUtil.userHasRoles(currentUser, environment.worldskillsAppId, environment.appRoles.ADMIN, environment.appRoles.PRINT);
      })
    )

    // load selectedEvent and data depending on it
    combineLatest([this.appService.selectedEvent, this.route.queryParams])
      .subscribe(([event, params]) => {
        this.selectedEvent = event;

        this.personAcrService.loadFilterFromQueryParams(params, this.fetchParams);
        this.loadPeople();
      });
  }

  loadPeople() {
    this.loading = true;
    this.personAcrService.getAccreditations(this.selectedEvent.id, this.fetchParams).subscribe(res => {
      this.result = res;
      this.loading = false;
    })
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
      this.updateSearchQueryParams();
    }
  }

  changeLimit(limit: number) {
    this.fetchParams = {
      ...this.fetchParams,
      limit: limit,
      offset: 0,
    };
    this.updateSearchQueryParams();
    return false;
  }

  checkAll() {
    this.result.people.forEach(p => p.checked = this.allChecked);
  }

  editSelected() {
    this.showEditSelectedForm = true;
    return false;
  }

  get selectedPeople() {
    return this.result?.people.filter(p => p.checked);
  }

  printSelected() {

    const ids = this.selectedPeople.map(p => p.id);

    const queryParams: Params = {};
    queryParams['id'] = ids;

    const urlTree = this.router.createUrlTree(['../print'], {relativeTo: this.route, queryParams});
    const url = this.router.serializeUrl(urlTree);
    window.open(url, '_blank');

    return false;
  }

  hasSelected(): boolean {
    return this.selectedPeople.length > 0;
  }

  doesResultHasMember(): boolean {
    return this.result.people.filter(p => !GenericUtil.isNullOrUndefined(p.member)).length > 0;
  }

  filter(params: PersonAccreditationSummaryReqParams) {
    this.fetchParams = {...params};
    this.updateSearchQueryParams();
  }

  private updateSearchQueryParams(): void {
    const queryParams: Params = this.personAcrService.buildQueryParams(this.fetchParams);

    this.router.navigate(
      [],
      {
        relativeTo: this.route,
        queryParamsHandling: 'merge',
        queryParams
      });
  }

  selectPerson(personAcr: PersonAccreditationSummary) {
    this.selectedPerson.emit(personAcr);
  }
}
