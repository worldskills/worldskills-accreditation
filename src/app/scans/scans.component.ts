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
        this.fetchParams = this.scanService.initialiseFetchParams(this.selectedEvent);
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

  filter(params: PersonAccreditationScanReqParams) {
    this.fetchParams = {...params};
    this.loadData();
  }

  fetch(page: number) {
    if ((this.fetchParams.offset / this.fetchParams.limit) !== (page - 1)) {
      this.fetchParams = {
        ...this.fetchParams,
        limit: this.fetchParams.limit,
        offset: this.fetchParams.limit ? this.fetchParams.limit * (page - 1) : 0,
      };
      this.loadData();
    }
  }
}
