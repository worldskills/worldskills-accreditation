import {Component, OnInit} from '@angular/core';
import {WsComponent} from "@worldskills/worldskills-angular-lib";
import {Event} from "../../types/event";
import {AppService} from "../../services/app/app.service";
import {
  PersonAccreditationScanContainer,
  PersonAccreditationScanReqParams
} from "../../types/person-accreditation-scan";
import {ScanService} from "../../services/scan/scan.service";

@Component({
  selector: 'app-scans',
  templateUrl: './scans.component.html',
  styleUrls: ['./scans.component.css']
})
export class ScansComponent extends WsComponent implements OnInit {

  selectedEvent: Event;
  fetchParams: PersonAccreditationScanReqParams;
  result: PersonAccreditationScanContainer;
  loading = false;

  constructor(private appService: AppService,
              private scanService: ScanService) {
    super();
  }

  ngOnInit(): void {
    this.appService.showMenuTabs.next(true);
    this.subscribe(
      this.appService.selectedEvent.subscribe(event => {
        this.selectedEvent = event;
        this.resetFilter(this.selectedEvent);
      })
    );
  }

  private loadData() {
    this.loading = true;
    this.subscribe(
      this.scanService.getScans(this.selectedEvent.id, this.fetchParams).subscribe(res => {
        this.result = res;
        this.loading = false;
      })
    );
  }

  private resetFilter(selectedEvent: Event): void {
    this.fetchParams = {
      from: null,
      to: null,
      eventId: selectedEvent.id,
      zone: null,
      delegate_type: null,
      member: null,
      accreditation: null
    }
  }

  filter(params: PersonAccreditationScanReqParams) {
    this.fetchParams = {...params};
    this.loadData();
  }

}
