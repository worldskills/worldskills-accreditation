import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {GenericUtil, WsComponent} from "@worldskills/worldskills-angular-lib";
import {AppService} from "../../services/app/app.service";
import {DomSanitizer} from "@angular/platform-browser";
import {Event} from "../../types/event";
import {EventService} from "../../services/event/event.service";
import {ActivatedRoute} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";
import { combineLatest } from 'rxjs';
import { VehicleService } from 'src/services/vehicle/vehicle.service';
import { VehicleAccreditation, VehicleAccreditationFetchParams } from 'src/types/vehicle-accreditation';


@Component({
  selector: 'app-vehicle-print',
  templateUrl: './vehicle-print.component.html',
  styleUrls: ['../../styles/badge.css', './vehicle-print.component.css'],
  encapsulation: ViewEncapsulation.None,
  standalone: false
})
export class VehiclePrintComponent extends WsComponent implements OnInit {

  selectedEvent: Event;
  fetchParams: VehicleAccreditationFetchParams;
  vehicles: VehicleAccreditation[] = [];
  loading = false;

  constructor(private eventService: EventService,
              private route: ActivatedRoute,
              private appService: AppService,
              private sanitizer: DomSanitizer,
              private translate: TranslateService,
              private vehicleService: VehicleService) {
    super();
  }

  ngOnInit(): void {
    // remove header, footer, breadcrumb, etc
    this.appService.showWSLayout.next(false);

    this.fetchParams = this.vehicleService.initialiseFetchParams();

    // fetch event
    this.route.params.subscribe(({eventId}) => {
      this.subscribe(
        this.eventService.get(eventId).subscribe(event => {
          this.selectedEvent = event;
          this.appService.selectedEvent.next(this.selectedEvent);

          this.route.queryParamMap.subscribe(params => {
            const ids = params.getAll('id');
            if (ids.length > 0) {
              this.loadVehiclesByIds(ids.map(id => +id));
            } else {
              // fetch people from query params
              this.route.queryParams.subscribe(params => {
                this.vehicleService.loadFilterFromQueryParams(params, this.fetchParams);
                this.loadVehicles();
              });
            }
          });
        })
      );
    });
  }

  private loadVehicles() {
    this.loading = true;
    this.vehicleService.getVehicles(this.selectedEvent.id, this.fetchParams).subscribe(res => {
      const ids = res.vehicles.map(p => p.id);
      document.title = 'VAPP_' + ids.join('-');
      this.vehicles = res.vehicles;
      this.loading = false;
    })
  }

  private loadVehiclesByIds(ids: number[]) {
    this.loading = true;
    const observables = ids.map(id => this.vehicleService.getVehicleAccreditation(this.selectedEvent.id, id));
    document.title = 'VAPP_' + ids.join('-');
    combineLatest(observables).subscribe(vehicles => {
      this.vehicles = vehicles;
      this.loading = false;
    });
  }

  openBrowserPrintPreview(): void {
    window.onbeforeprint = () => {
      this.vehicles.map(p => p.id).forEach(vehicleId => {
        this.vehicleService.markAsPrinted(this.selectedEvent.id, vehicleId).subscribe();
      });
    }
    window.print();
  }
}
