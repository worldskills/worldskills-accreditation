import {Component, OnInit, ViewChild} from '@angular/core';
import {WsComponent} from "@worldskills/worldskills-angular-lib";
import {Zone} from "../../types/zone";
import {ZoneService} from "../../services/zone/zone.service";
import {AppService} from "../../services/app/app.service";
import {Event} from "../../types/event";
import {ZoneRequestForm} from "../../types/zone-request/zone-request-form";
import {ZoneRequestService} from "../../services/zone-request/zone-request.service";
import {combineLatest} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {ZoneRequestFormService} from "../../services/zone-request-form/zone-request-form.service";
import {ToastService} from "angular-toastify";
import {ZoneRequest} from "../../types/zone-request/zone-request";
import {NgForm} from "@angular/forms";

@Component({
  selector: 'app-zone-request',
  templateUrl: './zone-request.component.html',
  styleUrls: ['./zone-request.component.css']
})
export class ZoneRequestComponent extends WsComponent implements OnInit {

  @ViewChild('form') form: NgForm;
  selectedEvent: Event;
  zoneReqForm: ZoneRequestForm;

  zones: Zone[];
  loading = false;


  constructor(private appService: AppService,
              private zoneService: ZoneService,
              private route: ActivatedRoute,
              private zoneReqService: ZoneRequestService,
              private zoneReqFormService: ZoneRequestFormService,
              private toastService: ToastService,
              private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.appService.showMenuTabs.next(false);
    this.appService.showEventNameHeader.next(false);

    // get selected Event and ZoneRequestForm's RandomHash from route params
    combineLatest([this.appService.selectedEvent, this.route.params])
      .subscribe(([event, {zoneRequestFormHash}]) => {
        this.selectedEvent = event;

        this.subscribe(
          // load ZoneRequestForm
          this.zoneReqFormService.getZoneReqForm(this.selectedEvent.id, zoneRequestFormHash).subscribe(zoneReqForm => {
            this.zoneReqForm = zoneReqForm;
            this.zones = this.zoneReqForm.zones.filter(zone => zone.available_for_request).map(z => z.zone);
          })
        )
      });
  }

  submit(): void {
    if (this.form.valid) {
      this.loading = true;

      const zReq: ZoneRequest = {
        first_choice_zone: this.form.value.first_choice_zone,
        second_choice_zone: this.form.value.second_choice_zone,
        objective: this.form.value.objective,
        zone_request_form: this.zoneReqForm
      };

      this.subscribe(
        this.zoneReqService.requestZone(this.selectedEvent.id, this.zoneReqForm.id, zReq).subscribe({
          next: (zr) => {
            this.loading = false;
            this.toastService.success('Zone request submitted successfully!');
            this.router.navigate(['zone-requests/' + zr.id], {relativeTo: this.route});
          },
          error: (err) => {
            this.loading = false;
            this.toastService.error(err.error.user_msg || 'Failed to submit zone request!');
          }
        })
      );
    }
  }
}
