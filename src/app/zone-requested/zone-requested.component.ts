import {Component, OnInit} from '@angular/core';
import {WsComponent} from "@worldskills/worldskills-angular-lib";
import {AppService} from "../../services/app/app.service";
import {combineLatest} from "rxjs";
import {ActivatedRoute} from "@angular/router";
import {Event} from "../../types/event";
import {ZoneRequestService} from "../../services/zone-request/zone-request.service";
import {ZoneRequest} from "../../types/zone-request/zone-request";

@Component({
  selector: 'app-zone-requested',
  templateUrl: './zone-requested.component.html',
  styleUrls: ['./zone-requested.component.css']
})
export class ZoneRequestedComponent extends WsComponent implements OnInit {

  selectedEvent: Event;
  zoneReq: ZoneRequest;

  constructor(private appService: AppService,
              private route: ActivatedRoute,
              private zoneReqService: ZoneRequestService){
    super();
  }

  ngOnInit(): void {
    this.appService.showMenuTabs.next(false);
    this.appService.showEventNameHeader.next(false);

    // get selected Event and requested ZoneRequest from route params
    combineLatest([this.appService.selectedEvent, this.route.params])
      .subscribe(([event, {zoneReqId}]) => {
        this.selectedEvent = event;

        this.subscribe(
          this.zoneReqService.getRequest(this.selectedEvent.id, zoneReqId).subscribe(zoneReq => {
            this.zoneReq = zoneReq;
            console.log(this.zoneReq);
          })
        )
      });
  }
}
