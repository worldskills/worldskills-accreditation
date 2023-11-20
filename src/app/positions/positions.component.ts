import {Component, OnInit} from '@angular/core';
import {WsComponent} from "@worldskills/worldskills-angular-lib";
import {Event} from "../../types/event";
import {AppService} from "../../services/app/app.service";
import {PositionDelegateTypeService} from "../../services/position-delegate-type/position-delegate-type.service";
import {PositionDelegateType} from "../../types/position-delegate-type";
import {DelegateType} from "../../types/delegate-type";
import {DelegateTypeService} from "../../services/delegate-type/delegate-type.service";

@Component({
  selector: 'app-positions',
  templateUrl: './positions.component.html',
  styleUrls: ['./positions.component.css']
})
export class PositionsComponent extends WsComponent implements OnInit {

  selectedEvent: Event;
  positions: PositionDelegateType[];
  delegateTypes: DelegateType[];
  loading: boolean = false;

  constructor(private appService: AppService,
              private posDelTypeService: PositionDelegateTypeService,
              private delTypeService: DelegateTypeService
  ) {
    super();
  }

  ngOnInit(): void {
    this.subscribe(
      this.appService.selectedEvent.subscribe(event => {
        this.selectedEvent = event;

        this.loading = true;
        this.subscribe(
          // load positions for selected event
          this.posDelTypeService.getPositions(this.selectedEvent.id).subscribe(res => {
            this.positions = res.positions;
            this.loading = false;
          }),
          this.delTypeService.getList(this.selectedEvent.id).subscribe(res => {
            this.delegateTypes = res.delegate_types;
          })
        );
      })
    )
  }

  moveUp(pos: PositionDelegateType) {

  }

  moveDown(pos: PositionDelegateType) {

  }
}
