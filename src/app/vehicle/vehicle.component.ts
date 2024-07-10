import {Component, OnInit} from '@angular/core';
import {NgAuthService, UserRoleUtil, WsComponent} from "@worldskills/worldskills-angular-lib";
import {ActivatedRoute, Router} from "@angular/router";
import {Event} from "../../types/event";
import {AppService} from "../../services/app/app.service";
import {combineLatest, debounceTime, distinctUntilChanged, Subject} from "rxjs";
import {VehicleAccreditation} from "../../types/vehicle-accreditation";
import {environment} from "../../environments/environment";
import {DelegateType} from "../../types/delegate-type";
import {DelegateTypeService} from "../../services/delegate-type/delegate-type.service";
import {ZoneService} from "../../services/zone/zone.service";
import {Zone} from "../../types/zone";
import {Location} from "@angular/common";
import {ToastService} from "angular-toastify";
import { Log } from '../../types/log';
import { VehicleService } from '../../services/vehicle/vehicle.service';

@Component({
  selector: 'app-vehicle',
  templateUrl: './vehicle.component.html',
  styleUrls: ['./vehicle.component.css']
})
export class VehicleComponent extends WsComponent implements OnInit {

  readonly peopleURL = environment.worldskillsPeople;
  selectedEvent: Event;
  delegateTypes: DelegateType[];
  zones: Zone[] = [];
  logs: Log[] = [];

  // override vehicle acr
  vehicleAcr: VehicleAccreditation;
  savingVehicleAcr = false;
  badgeLinesChange: Subject<string> = new Subject<string>();

  // permissions
  hasEditPermission = false;
  hasPrintPermission = false;
  hasAdminPermission = false;

  constructor(private appService: AppService,
              private router: Router,
              private route: ActivatedRoute,
              private vehicleService: VehicleService,
              private delegateTypeService: DelegateTypeService,
              private zoneService: ZoneService,
              private location: Location,
              private authService: NgAuthService,
              private toastService: ToastService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.appService.showMenuTabs.next(false);

    // load current user and check permissions
    this.subscribe(
      this.authService.currentUser.subscribe(currentUser => {
        this.hasEditPermission = UserRoleUtil.userHasRoles(currentUser, environment.worldskillsAppId, environment.appRoles.ADMIN, environment.appRoles.EDIT_VEHICLES);
        this.hasPrintPermission = UserRoleUtil.userHasRoles(currentUser, environment.worldskillsAppId, environment.appRoles.ADMIN, environment.appRoles.PRINT_VEHICLES);
        this.hasAdminPermission = UserRoleUtil.userHasRoles(currentUser, environment.worldskillsAppId, environment.appRoles.ADMIN);
      })
    )

    // load selectedEvent and data depending on it
    combineLatest([this.appService.selectedEvent, this.authService.currentUser, this.route.params])
      .subscribe(([event, currentUser, {vehicleAcrId}]) => {
        this.selectedEvent = event;
        this.subscribe(
          this.loadVehicleAccreditation(vehicleAcrId),
          this.delegateTypeService.getList(this.selectedEvent.id, {available_vehicle_accreditation: true}).subscribe(res => {
            this.delegateTypes = res.delegate_types;
          }),
          this.zoneService.getList(this.selectedEvent.id, {available_vehicle_accreditation: true}).subscribe(res => {
            this.zones = res.zones;
          })
        );

      });

    this.badgeLinesChange.pipe(debounceTime(400), distinctUntilChanged()).subscribe(lines => {
      this.vehicleAcr.overwrite_lines = lines;
      this.updateVehicleAccreditation();
    });
  }

  private loadVehicleAccreditation(vehicleAcrId: number) {
    return this.vehicleService.getVehicleAccreditation(this.selectedEvent.id, vehicleAcrId).subscribe(vehicle => {
      this.vehicleAcr = vehicle;
    });
  }

  updateVehicleAccreditation(): void {
    this.savingVehicleAcr = true;
    this.subscribe(
      this.vehicleService.updateVehicleAccreditation(this.selectedEvent.id, this.vehicleAcr.id, this.vehicleAcr).subscribe(res => {
        this.vehicleAcr = res;
        this.savingVehicleAcr = false;
      })
    );
  }

  onDelTypeChange(dt: DelegateType) {
    this.vehicleAcr.delegate_type = dt;
    this.updateVehicleAccreditation();
  }

  onBadgeLinesChange(lines: string) {
    this.badgeLinesChange.next(lines);
  }

  private hasZone(zone: Zone): boolean {
    return this.vehicleAcr.zones.map(z => z.id).includes(zone.id);
  }

  getZonesToAdd(): Zone[] {
    return this.zones.filter(zone => !this.hasZone(zone));
  }

  getZonesToRemove(): Zone[] {
    return this.zones.filter(zone => this.hasZone(zone));
  }

  addZone(zone: Zone) {
    if (this.vehicleAcr.zones_add == null) {
      this.vehicleAcr.zones_add = [];
    }
    if (this.vehicleAcr.zones_add.filter(z => z.id === zone.id).length > 0) {
      this.vehicleAcr.zones_add = this.vehicleAcr.zones_add.filter(z => z.id !== zone.id);
    } else {
      this.vehicleAcr.zones_add.push(zone);
    }

    this.updateVehicleAccreditation();
  }

  removeZone(zone: Zone) {
    if (this.vehicleAcr.zones_remove == null) {
      this.vehicleAcr.zones_remove = [];
    }

    if (this.vehicleAcr.zones_remove.filter(z => z.id === zone.id).length > 0) {
      this.vehicleAcr.zones_remove = this.vehicleAcr.zones_remove.filter(z => z.id !== zone.id);
    } else {
      this.vehicleAcr.zones_remove.push(zone);
    }

    this.updateVehicleAccreditation();
  }

  printPreview(): void {
    const urlTree = this.router.createUrlTree(['../print'], {relativeTo: this.route, queryParams: {id: this.vehicleAcr.id}});
    const url = this.router.serializeUrl(urlTree);
    if (this.vehicleAcr.printed) {
      if (confirm('This accreditation badge has already been printed. If the badge has been lost, it should be marked as invalid before reprinting ("Invalidate badge"). Proceed with printing without invalidating the badge?')) {
        window.open(url, '_blank');
      }
    } else {
      window.open(url, '_blank');
    }
  }

  backToPeopleList(): void {
    this.location.back();
  }

  invalidateBadge(): void {
    if (confirm('This will generate a new random code for the QR code. Any existing badge will no longer be valid. Proceed?')) {
      this.vehicleService.invalidateBadge(this.selectedEvent.id, this.vehicleAcr.id).subscribe(_ => {
        this.toastService.success('New random code for QR code generated.');

        // reload vehicle accreditation
        this.subscribe(this.loadVehicleAccreditation(this.vehicleAcr.id));
      });
    }
  }

  markAsDistributed(): void {
    this.vehicleService.markAsDistributed(this.selectedEvent.id, this.vehicleAcr.id).subscribe(_ => {
      this.toastService.success('Vehicle accreditation marked as distributed');

      // reload vehicle accreditation
      this.subscribe(this.loadVehicleAccreditation(this.vehicleAcr.id));
    });
  }
}
