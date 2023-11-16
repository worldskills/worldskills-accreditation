import {Component, OnInit} from '@angular/core';
import {WsComponent} from "@worldskills/worldskills-angular-lib";
import {AppService} from "../../services/app/app.service";
import {DelegateTypeService} from "../../services/delegate-type/delegate-type.service";
import {DelegateType} from "../../types/delegate-type";
import {Event} from "../../types/event";

@Component({
  selector: 'app-delegate-types',
  templateUrl: './delegate-types.component.html',
  styleUrls: ['./delegate-types.component.css']
})
export class DelegateTypesComponent extends WsComponent implements OnInit {

  selectedEvent: Event;
  delegateTypes: DelegateType[];

  constructor(private appService: AppService,
              private delTypeService: DelegateTypeService) {
    super();
  }

  ngOnInit(): void {
    this.subscribe(
      this.appService.selectedEvent.subscribe(event => {
        this.selectedEvent = event;

        // load delegate types for selected event
        this.delTypeService.getDelegateTypes(this.selectedEvent.id).subscribe(res => {
          this.delegateTypes = res.delegate_types;
        });
      })
    )
  }

}
