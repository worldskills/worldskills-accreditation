import {Component, OnInit} from '@angular/core';
import {NgAuthService, UserRoleUtil, WsComponent} from "@worldskills/worldskills-angular-lib";
import {AppService} from "../../services/app/app.service";
import {Event} from "../../types/event";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {combineLatest} from "rxjs";
import {environment} from "../../environments/environment";
import { VehicleService } from '../../services/vehicle/vehicle.service';
import { VehicleAccreditationFetchParams, VehicleAccreditationList } from '../../types/vehicle-accreditation';

@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.css']
})
export class VehiclesComponent extends WsComponent implements OnInit {

  allChecked = false;
  selectedEvent: Event;
  fetchParams: VehicleAccreditationFetchParams;
  result: VehicleAccreditationList;
  loading = false;
  showEditSelectedForm = false;

  hasPrintPermission = false;

  constructor(private appService: AppService,
              private vehicleService: VehicleService,
              private router: Router,
              private route: ActivatedRoute,
              private authService: NgAuthService) {
    super();
  }

  ngOnInit(): void {
    this.appService.showMenuTabs.next(true);
    this.fetchParams = this.vehicleService.initialiseFetchParams();

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

        this.loadVehicles();
      });
  }

  loadVehicles() {
    this.loading = true;
    this.vehicleService.getVehicles(this.selectedEvent.id, this.fetchParams).subscribe(res => {
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
    this.result.vehicles.forEach(v => v.checked = this.allChecked);
  }

  editSelected() {
    this.showEditSelectedForm = true;
    return false;
  }

  get selectedVehicles() {
    return this.result?.vehicles.filter(v => v.checked);
  }

  printSelected() {

    const ids = this.selectedVehicles.map(v => v.id);

    const queryParams: Params = {};
    queryParams['id'] = ids;

    const urlTree = this.router.createUrlTree(['./print'], {relativeTo: this.route, queryParams});
    const url = this.router.serializeUrl(urlTree);
    window.open(url, '_blank');

    return false;
  }

  hasSelected(): boolean {
    return this.selectedVehicles?.length > 0;
  }

  filter(params: VehicleAccreditationFetchParams) {
    this.fetchParams = {...params};
    this.updateSearchQueryParams();
  }

  private updateSearchQueryParams(): void {
    const queryParams = {};

    this.router.navigate(
      [],
      {
        relativeTo: this.route,
        queryParamsHandling: 'merge',
        queryParams
      });
  }
}
