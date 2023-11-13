import {Component, OnInit} from '@angular/core';
import {WsComponent} from "@worldskills/worldskills-angular-lib";
import {EventService} from "../../services/event/event.service";
import {ActivatedRoute} from "@angular/router";
import {Event} from "../../types/event";

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent extends WsComponent implements OnInit {

  currentEvent: Event;

  constructor(private eventService: EventService, private route: ActivatedRoute) {
    super();
  }

  ngOnInit(): void {
    this.route.params.subscribe(({eventId}) => {
      this.eventService.get(eventId).subscribe(event => {
        this.currentEvent = event;
      });
    });
  }

}
