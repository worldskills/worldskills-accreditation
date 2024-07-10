import {Component, OnInit, ViewChild} from '@angular/core';
import {NgAuthService, UserRoleUtil, WsComponent} from "@worldskills/worldskills-angular-lib";
import {AppService} from "../../services/app/app.service";
import {Event} from "../../types/event";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {combineLatest} from "rxjs";
import {environment} from "../../environments/environment";
import { VehicleService } from '../../services/vehicle/vehicle.service';
import { VehicleAccreditationFetchParams, VehicleAccreditationList } from '../../types/vehicle-accreditation';
import { DelegateType } from '../../types/delegate-type';
import { Zone } from '../../types/zone';
import { DelegateTypeService } from '../../services/delegate-type/delegate-type.service';
import { ZoneService } from '../../services/zone/zone.service';
import { VehicleGroup } from '../../types/vehicle-group';
import { VehicleGroupService } from '../../services/vehicle-group/vehicle-group.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-vehicles',
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.css']
})
export class VehiclesComponent extends WsComponent implements OnInit {

  @ViewChild('form') form: NgForm;

  allChecked = false;
  selectedEvent: Event;
  fetchParams: VehicleAccreditationFetchParams;
  result: VehicleAccreditationList;
  loading = false;
  showEditSelectedForm = false;

  hasPrintPermission = false;

  vehicleGroups: VehicleGroup[];
  delegateTypes: DelegateType[];
  zones: Zone[];
  yesNoSelections = [
    {value: true, label: 'Yes'},
    {value: false, label: 'No'},
  ];

  constructor(private appService: AppService,
              private vehicleService: VehicleService,
              private vehicleGroupService: VehicleGroupService,
              private delegateTypeService: DelegateTypeService,
              private zoneService: ZoneService,
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

        // load all filter options based on selected event
        this.subscribe(
          this.vehicleGroupService.getVehicleGroups(this.selectedEvent.id).subscribe(res => {
            this.vehicleGroups = res.groups;
          }),
          this.delegateTypeService.getList(this.selectedEvent.id, {available_vehicle_accreditation: true}).subscribe(res => {
            this.delegateTypes = res.delegate_types;
          }),
          this.zoneService.getList(this.selectedEvent.id, {available_vehicle_accreditation: true}).subscribe(res => {
            this.zones = res.zones;
          })
        );
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

  submit(): void {
    this.filter({...this.fetchParams, ...this.form.value});
  }

  printPreview(): void {
    this.submit();
    this.fetchParams = {...this.fetchParams, ...this.form.value};

    const queryParams: Params = this.vehicleService.buildQueryParams(this.fetchParams);
    queryParams['offset'] = 0;
    queryParams['limit'] = 9999;

    const urlTree = this.router.createUrlTree(['print'], {relativeTo: this.route, queryParams});
    const url = this.router.serializeUrl(urlTree);
    window.open(url, '_blank');
  }

  private updateSearchQueryParams(): void {
    const queryParams: Params = this.vehicleService.buildQueryParams(this.fetchParams);

    this.router.navigate(
      [],
      {
        relativeTo: this.route,
        queryParamsHandling: 'merge',
        queryParams
      });
  }
}
