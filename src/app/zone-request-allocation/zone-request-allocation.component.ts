import {Component, OnInit} from '@angular/core';
import {WsComponent} from "@worldskills/worldskills-angular-lib";
import {Event} from "../../types/event";
import {Zone} from "../../types/zone";
import {AppService} from "../../services/app/app.service";
import {ZoneService} from "../../services/zone/zone.service";
import {ZoneRequestForm} from "../../types/zone-request/zone-request-form";
import {combineLatest} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {ZoneRequestFormService} from "../../services/zone-request-form/zone-request-form.service";
import {ZoneRequestFormZone} from "../../types/zone-request/zone-request-form-zone";

@Component({
  selector: 'app-zone-request-allocation',
  templateUrl: './zone-request-allocation.component.html',
  styleUrls: ['./zone-request-allocation.component.css']
})
export class ZoneRequestAllocationComponent extends WsComponent implements OnInit {

  selectedEvent: Event;
  currentForm: ZoneRequestForm;
  loading = false;
  zones: Zone[];
  allocatableZones: Zone[];
  allocatableFormZones: ZoneRequestFormZone[];

  wristbandDistributionScanning: boolean = false;

  scannedResultList: string[] = [];

  constructor(private appService: AppService,
              private zoneService: ZoneService,
              private route: ActivatedRoute,
              private zoneReqFormService: ZoneRequestFormService,
              ) {
    super();
  }

  ngOnInit(): void {
    this.appService.showMenuTabs.next(false);

    combineLatest([this.appService.selectedEvent, this.route.params])
      .subscribe(([event, {zoneRequestFormHash}]) => {
        this.selectedEvent = event;

        this.subscribe(
          // load zones
          this.zoneService.getList(this.selectedEvent.id).subscribe(res => {
            this.zones = res.zones;
          }),
          // load ZoneRequestForm
          this.zoneReqFormService.getZoneReqForm(this.selectedEvent.id, zoneRequestFormHash).subscribe(zoneReqForm => {
            this.currentForm = zoneReqForm;
            this.allocatableFormZones = this.currentForm.zones.filter(zone => zone.available_for_allocation);
            this.allocatableZones = this.allocatableFormZones.map(z => z.zone);
          }),
        )
      });
  }

  scanResult(result: string) {
    this.scannedResultList.push(result);
  }
}
