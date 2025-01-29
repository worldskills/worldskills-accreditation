import {Component, OnInit} from '@angular/core';
import {FetchParams, WsComponent} from "@worldskills/worldskills-angular-lib";
import {EventService} from "../../services/event/event.service";
import {EventContainer} from "../../types/event";

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css'],
  standalone: false
})
export class EventsComponent extends WsComponent implements OnInit {

  events: EventContainer;
  loading = false;
  fetchParams: FetchParams = {offset: 0, limit: 10}

  constructor(private eventService: EventService) {
    super();
  }

  ngOnInit(): void {
    this.loadEvents();
  }

  private loadEvents() {
    this.loading = true;
    this.eventService.getList(this.fetchParams).subscribe(res => {
      this.events = res;
      this.loading = false;
    });
  }

  fetch(page: number) {
    if ((this.fetchParams.offset / this.fetchParams.limit) !== (page - 1)) {
      this.fetchParams = {
        ...this.fetchParams,
        limit: this.fetchParams.limit,
        offset: this.fetchParams.limit ? this.fetchParams.limit * (page - 1) : 0,
      };
      this.loadEvents();
    }
  }
}
