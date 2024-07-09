import {Component, OnInit, ViewChild} from '@angular/core';
import {WsComponent} from "@worldskills/worldskills-angular-lib";
import {Event} from "../../types/event";
import { AppService } from '../../services/app/app.service';
import { DelegateTypeService } from '../../services/delegate-type/delegate-type.service';
import { DelegateType } from '../../types/delegate-type';
import { VehicleGroupService } from '../../services/vehicle-group/vehicle-group.service';
import { VehicleGroup } from '../../types/vehicle-group';
import {NgForm} from "@angular/forms";
import { VehicleAccreditationRequest } from '../../types/vehicle-accreditation';
import { VehicleService } from '../../services/vehicle/vehicle.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from 'angular-toastify';
import { Zone } from 'src/types/zone';
import { ZoneService } from 'src/services/zone/zone.service';

@Component({
  selector: 'app-vehicle-add',
  templateUrl: './vehicle-add.component.html'
})
export class VehicleAddComponent extends WsComponent implements OnInit {

  private selectedEvent: Event;

  loading = false;

  delegateTypes: DelegateType[];
  vehicleGroups: VehicleGroup[];

  zones: Zone[] = [];

  @ViewChild('form') form: NgForm;

  model: VehicleAccreditationRequest = {};

  constructor(
    private toastService: ToastService,
    private appService: AppService,
    private delegateTypeService: DelegateTypeService,
    private vehicleGroupService: VehicleGroupService,
    private vehicleService: VehicleService,
    private zoneService: ZoneService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    super();
  }

  ngOnInit(): void {
    this.subscribe(
      // load selected event
      this.appService.selectedEvent.subscribe(event => {
        this.selectedEvent = event;

        this.subscribe(
          this.delegateTypeService.getList(this.selectedEvent.id, {available_vehicle_accreditation: true}).subscribe(res => {
            this.delegateTypes = res.delegate_types;
          }),
          this.vehicleGroupService.getVehicleGroups(this.selectedEvent.id).subscribe(res => {
            this.vehicleGroups = res.groups;
          }),
          this.zoneService.getList(this.selectedEvent.id, {available_vehicle_accreditation: true}).subscribe(res => {
            this.zones = res.zones.filter(z => z.quota !== null);
          }),
        );
      })
    );
  }

  addVehicleGroup(name: string) {
    return new Promise((resolve) => {
      this.loading = true;
      this.vehicleGroupService.createVehicleGroup(this.selectedEvent.id, {name}).subscribe(res => {
        resolve(res);
        this.loading = false;
      });
    });
  }

  createVehicles() {
    this.vehicleService.createVehicleAccrediations(this.selectedEvent.id, this.form.value).subscribe(res => {
      this.toastService.success('Vehicle Passes added');
      this.router.navigate(['../'], {relativeTo: this.route});
    }, err => {
      this.toastService.error('Error adding Vehicle Passes: ' + (err.error.user_msg || 'Unknown error'));
    });
  }
}
