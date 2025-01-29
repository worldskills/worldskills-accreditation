import {Component, OnInit} from '@angular/core';
import {GenericUtil, WsComponent} from "@worldskills/worldskills-angular-lib";
import {Event} from "../../types/event";
import {Zone} from "../../types/zone";
import {AppService} from "../../services/app/app.service";
import {ZoneService} from "../../services/zone/zone.service";
import {ZoneRequestForm} from "../../types/zone-request/zone-request-form";
import {combineLatest} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {ZoneRequestFormService} from "../../services/zone-request-form/zone-request-form.service";
import {ZoneRequestFormZone} from "../../types/zone-request/zone-request-form-zone";
import {ZoneRequestAllocationService} from "../../services/zone-request-allocation/zone-request-allocation.service";
import {ToastService} from "angular-toastify";
import {ZoneRequestAllocation} from "../../types/zone-request/zone-request-allocation";

@Component({
  selector: 'app-zone-request-allocation',
  templateUrl: './zone-request-allocation.component.html',
  styleUrls: ['./zone-request-allocation.component.css'],
  standalone: false
})
export class ZoneRequestAllocationComponent extends WsComponent implements OnInit {

  selectedEvent: Event;
  currentForm: ZoneRequestForm;
  loading = false;
  viewFocusMode: 'DEFAULT' | 'PENDING' | 'ALLOCATED' = 'DEFAULT';
  zones: Zone[];
  allocatableZones: Zone[];
  allocatableFormZones: ZoneRequestFormZone[];

  wristbandDistributionScanning: boolean = false;
  wristbandScanDistributed: ZoneRequestAllocation[] = [];

  constructor(private appService: AppService,
              private zoneService: ZoneService,
              private route: ActivatedRoute,
              private zoneReqFormService: ZoneRequestFormService,
              private zoneReqAllocationService: ZoneRequestAllocationService,
              private toastService: ToastService,
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

  scanResult(paID: number): void {
    const updateWristband = (zoneReqAllocId: number) => this.zoneReqAllocationService.updateWristbandDistribution(this.selectedEvent.id, zoneReqAllocId, true).subscribe({
      next: () => {
        this.toastService.success('AccessID distributed successfully');
        this.zoneReqAllocationService.refresh.next(true);
      },
      error: (err) => {
        this.toastService.error(err?.error?.user_msg ?? 'Failed to distribute AccessID');
      }
    });

    this.zoneReqAllocationService.getAllocationsForPersonAccreditation(this.selectedEvent.id, this.currentForm.id, paID).subscribe({
      next: res => {
        // update the wristband distribution for each allocation
        res.allocations.forEach(allocation => {
          // check if the wristband is already distributed
          if (!GenericUtil.isNullOrUndefined(allocation.wristband_distributed_at)) {
            this.toastService.warn('AccessID was already distributed for this person');
          } else {
            updateWristband(allocation.id);
            this.wristbandScanDistributed = [allocation, ...this.wristbandScanDistributed];
          }
        });
      },
      error: (err) => {
        this.toastService.error(err?.error?.user_msg ?? 'Failed to find the person accreditation for the scanned QR code');
      }
    });


  }
}
