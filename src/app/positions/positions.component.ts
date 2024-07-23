import {Component, OnInit} from '@angular/core';
import {WsComponent} from "@worldskills/worldskills-angular-lib";
import {Event} from "../../types/event";
import {AppService} from "../../services/app/app.service";
import {PositionDelegateTypeService} from "../../services/position-delegate-type/position-delegate-type.service";
import {PositionDelegateType} from "../../types/position-delegate-type";
import {DelegateType} from "../../types/delegate-type";
import {DelegateTypeService} from "../../services/delegate-type/delegate-type.service";
import {ToastService} from "angular-toastify";

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
              private delTypeService: DelegateTypeService,
              private toastService: ToastService
  ) {
    super();
  }

  ngOnInit(): void {
    this.appService.showMenuTabs.next(true);
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

  moveToTop(idx: number, pos: PositionDelegateType) {
    this.positions.splice(idx, 1);
    this.positions.splice(0, 0, pos);

    this.updatePositionsSort();
  }

  moveToBottom(idx: number, pos: PositionDelegateType) {
    this.positions.splice(idx, 1);
    this.positions.push(pos);

    this.updatePositionsSort();
  }

  moveUp(idx: number, pos: PositionDelegateType) {
    this.positions[idx] = this.positions[idx - 1];
    this.positions[idx - 1] = pos;

    this.updatePositionsSort();
  }

  moveDown(idx: number, pos: PositionDelegateType) {
    this.positions[idx] = this.positions[idx + 1];
    this.positions[idx + 1] = pos;

    this.updatePositionsSort();
  }

  private updatePositionsSort():void {
    for (let i = 0; i < this.positions.length; i++) {
      this.positions[i].sort = i + 1;
    }

    this.posDelTypeService.update(this.selectedEvent.id, {positions: this.positions}).subscribe(res => {
      this.positions = res.positions;
      this.toastService.success('Positions are sorted!');
    });
  }

  onDelTypeChange(selectedDelType: DelegateType, idx: number) {
    this.positions[idx].delegate_type = selectedDelType;
    this.posDelTypeService.update(this.selectedEvent.id, {positions: this.positions}).subscribe(res => {
      this.positions = res.positions;
      this.toastService.success('Position is saved!');
    });
  }
}
