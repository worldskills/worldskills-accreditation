import {Component, OnInit, ViewChild} from '@angular/core';
import {WsComponent} from "@worldskills/worldskills-angular-lib";
import {AppService} from "../../services/app/app.service";
import {DelegateTypeService} from "../../services/delegate-type/delegate-type.service";
import {DelegateType} from "../../types/delegate-type";
import {Event} from "../../types/event";
import {ToastService} from "angular-toastify";
import { Zone } from '../../types/zone';
import { ZoneService } from 'src/services/zone/zone.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-delegate-types',
  templateUrl: './delegate-types.component.html',
  styleUrls: ['./delegate-types.component.css'],
  standalone: false
})
export class DelegateTypesComponent extends WsComponent implements OnInit {

  selectedEvent: Event;
  delegateTypes: DelegateType[];
  zones: Zone[];
  loading = false;
  manageDelType: DelegateType = null;

  allChecked = false;
  showEditSelectedForm = false;
  loadingEditSelected = false;
  addZones: Zone[] = [];
  @ViewChild('editSelectedForm') editSelectedForm: NgForm;

  constructor(private appService: AppService,
              private delTypeService: DelegateTypeService,
              private zoneService: ZoneService,
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
        this.delegateTypes = res.positions;
        this.loading = false;
      }),
      this.zoneService.getList(this.selectedEvent.id).subscribe(res => {
        this.zones = res.zones;
      })
    );
  }

  checkAll() {
    this.delegateTypes.forEach(dt => dt.checked = this.allChecked);
  }

  get selectedDelegateTypes() {
    return this.delegateTypes?.filter(dt => dt.checked);
  }

  editSelected() {
    this.showEditSelectedForm = true;
    return false;
  }

  hasSelected(): boolean {
    return this.selectedDelegateTypes?.length > 0;
  }

  submitEditSelect() {

    this.loadingEditSelected = true;

    this.selectedDelegateTypes.forEach(dt => {
      this.editSelectedForm.value['addZones'].forEach((z: Zone) => {
        if (!dt.zones.find(zz => zz.id === z.id)) {
          dt.zones.push(z);
        }
      });
      this.delTypeService.update(this.selectedEvent.id, dt).subscribe(res => {
        const index = this.delegateTypes.findIndex(d => d.id === dt.id);
        this.delegateTypes[index] = dt;
        this.toastService.success('Delegate Type is saved!');
        this.loadingEditSelected = false;
      });
    });

    this.editSelectedForm.resetForm();
  }

  updateDelType(dt: DelegateType): void {
    this.manageDelType = dt;
  }

  addNew(): void {
    this.manageDelType = {
      id: 0,
      code: '',
      name: null,
      line1: '',
      line2: '',
      line3: '',
      color: '',
      text_color: '',
      zones: [],
      wsEntity: null
    }
  }

  save(dt: DelegateType): void {
    this.delTypeService.update(this.selectedEvent.id, dt).subscribe(res => {
      const index = this.delegateTypes.findIndex(d => d.id === dt.id);
      this.delegateTypes[index] = dt;
      this.manageDelType = null;
      this.toastService.success('Delegate Type is saved!');
    });
  }
}
