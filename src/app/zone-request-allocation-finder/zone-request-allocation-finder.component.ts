import {Component, OnInit} from '@angular/core';
import {WsComponent} from "@worldskills/worldskills-angular-lib";
import {AppService} from "../../services/app/app.service";
import {combineLatest} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {Event} from "../../types/event";
import {ZoneRequestForm} from "../../types/zone-request/zone-request-form";
import {ZoneRequestFormService} from "../../services/zone-request-form/zone-request-form.service";
import {ZoneRequestAllocationService} from "../../services/zone-request-allocation/zone-request-allocation.service";
import {ToastService} from "angular-toastify";
import {ZoneRequestAllocation} from "../../types/zone-request/zone-request-allocation";
import {environment} from "../../environments/environment";

@Component({
  selector: 'app-zone-request-allocation-finder',
  templateUrl: './zone-request-allocation-finder.component.html',
  styleUrls: ['./zone-request-allocation-finder.component.css']
})
export class ZoneRequestAllocationFinderComponent extends WsComponent implements OnInit {

  appId = environment.worldskillsAppId;
  roles = environment.appRoles;
  selectedEvent: Event;
  currentForm: ZoneRequestForm;
  paAllocations: ZoneRequestAllocation[] = [];
  scan: boolean;

  constructor(private appService: AppService,
              private route: ActivatedRoute,
              private zoneReqFormService: ZoneRequestFormService,
              private zoneReqAllocService: ZoneRequestAllocationService,
              private toastService: ToastService) {
    super();
  }

  ngOnInit(): void {
    this.appService.showMenuTabs.next(false);

    combineLatest([this.appService.selectedEvent, this.route.params])
      .subscribe(([event, {zoneRequestFormHash}]) => {
        this.selectedEvent = event;

        this.subscribe(
          // load ZoneRequestForm
          this.zoneReqFormService.getZoneReqForm(this.selectedEvent.id, zoneRequestFormHash).subscribe(zoneReqForm => {
            this.currentForm = zoneReqForm;
          }),
        )
      });
  }

  scanResult(paID: number): void {
    this.zoneReqAllocService.getAllocationsForPersonAccreditation(this.selectedEvent.id, this.currentForm.id, paID).subscribe({
      next: res => {
        this.scan = false;
        // push to the top of the list
        this.paAllocations.unshift(...res.allocations);
      },
      error: (err) => {
        this.toastService.error(err?.error?.user_msg ?? 'Failed to find the person accreditation for the scanned QR code');
      }
    });
  }

  updateWristband(isDistributed: boolean, zoneReqAllocId: number): void {
    this.zoneReqAllocService.updateWristbandDistribution(this.selectedEvent.id, zoneReqAllocId, !isDistributed).subscribe({
      next: (res) => {
        this.toastService.success(!isDistributed ? 'Wristband marked as distributed!' : 'Wristband distribution removed');

        // update paAllocations list
        for (let i = this.paAllocations.length - 1; i >= 0; i--) {
          if (this.paAllocations[i].id === zoneReqAllocId) {
            this.paAllocations[i] = res;
            break;
          }
        }
      },
      error: (err) => {
        this.toastService.error(err?.error?.user_msg ?? 'Error updating wristband distribution');
      }
    });
  }
}
