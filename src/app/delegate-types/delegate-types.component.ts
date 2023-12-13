import {Component, OnInit} from '@angular/core';
import {WsComponent} from "@worldskills/worldskills-angular-lib";
import {AppService} from "../../services/app/app.service";
import {DelegateTypeService} from "../../services/delegate-type/delegate-type.service";
import {DelegateType} from "../../types/delegate-type";
import {Event} from "../../types/event";
import {ToastService} from "angular-toastify";

@Component({
  selector: 'app-delegate-types',
  templateUrl: './delegate-types.component.html',
  styleUrls: ['./delegate-types.component.css']
})
export class DelegateTypesComponent extends WsComponent implements OnInit {

  selectedEvent: Event;
  delegateTypes: DelegateType[];
  loading = false;
  manageDelType: DelegateType = null;

  constructor(private appService: AppService,
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

        // load delegate types for selected event
        this.loadData();
      })
    )
  }

  private loadData() {
    this.loading = true;
    this.subscribe(
      this.delTypeService.getList(this.selectedEvent.id).subscribe(res => {
        this.delegateTypes = res.delegate_types;
        this.loading = false;
      })
    );
  }

  updateDelType(dt: DelegateType): void {
    this.manageDelType = dt;
  }

  addNew(): void {
    this.manageDelType = {
      id: 0,
      code: '',
      name: '',
      line1: '',
      line2: '',
      line3: '',
      color: '',
      text_color: '',
      zones: []
    }
  }

  save(dt: DelegateType): void {
    (dt.id === 0 ? this.delTypeService.create(this.selectedEvent.id, dt) : this.delTypeService.update(this.selectedEvent.id, dt)).subscribe(res => {
      this.loadData();
      this.manageDelType = null;
      this.toastService.success('Delegate Type is saved!');
    });
  }

  deleteDelType(dt: DelegateType): void {
    if (confirm('Are you sure you want to delete this "' + dt.name + '" Delegate Type?')) {
      this.delTypeService.delete(this.selectedEvent.id, dt.id).subscribe(_ => {
        this.loadData();
        this.toastService.success('Delegate Type is deleted!');
      });
    }
  }
}
