import {Component, OnInit} from '@angular/core';
import {WsComponent} from "@worldskills/worldskills-angular-lib";
import {Event} from "../../types/event";
import {AppService} from "../../services/app/app.service";
import {ZoneService} from "../../services/zone/zone.service";
import {Zone} from "../../types/zone";
import {ToastService} from "angular-toastify";

@Component({
  selector: 'app-zones',
  templateUrl: './zones.component.html',
  styleUrls: ['./zones.component.css']
})
export class ZonesComponent extends WsComponent implements OnInit {

  selectedEvent: Event;
  zones: Zone[];
  loading = false;
  manageZone: Zone = null;

  constructor(private appService: AppService,
              private zoneService: ZoneService,
              private toastService: ToastService
  ) {
    super();
  }

  ngOnInit(): void {
    this.subscribe(
      this.appService.selectedEvent.subscribe(event => {
        this.selectedEvent = event;

        // load zones for selected event
        this.loadData();
      })
    )
  }

  private loadData() {
    this.loading = true;
    this.subscribe(
      this.zoneService.getList(this.selectedEvent.id).subscribe(res => {
        this.zones = res.zones;
        this.loading = false;
      })
    );
  }

  moveUp(zone: Zone) {

  }

  moveDown(zone: Zone) {

  }

  updateZone(zone: Zone): void {
    this.manageZone = zone;
  }

  addNew(): void {
    this.manageZone = {
      id: 0,
      code: '',
      name: '',
      color: '',
      text_color: '',
      sort: 0
    };
  }

  save(zone: Zone): void {
    (zone.id === 0 ? this.zoneService.create(this.selectedEvent.id, zone) : this.zoneService.update(this.selectedEvent.id, zone)).subscribe(res => {
      this.loadData();
      this.manageZone = null;
      this.toastService.success('Zone is saved!');
    });
  }
}
