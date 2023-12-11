import {Component, Input, OnInit} from '@angular/core';
import {DelegateType} from "../../types/delegate-type";
import {WsComponent} from "@worldskills/worldskills-angular-lib";
import {AppService} from "../../services/app/app.service";
import {DelegateTypeService} from "../../services/delegate-type/delegate-type.service";
import {ZoneService} from "../../services/zone/zone.service";
import {Zone} from "../../types/zone";
import {Event} from "../../types/event";
import {PersonAccreditationSummary} from "../../types/person-accreditation-summary";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-adhoc-printing',
  templateUrl: './adhoc-printing.component.html',
  styleUrls: ['./adhoc-printing.component.css']
})
export class AdhocPrintingComponent extends WsComponent implements OnInit {

  @Input() hasPrintPermission: boolean; // TODO: set this
  selectedEvent: Event;
  delegateTypes: DelegateType[];
  zones: Zone[];
  personEdit: PersonAccreditationSummary;
  people: PersonAccreditationSummary[] = [];

  action: 'ADD' | 'EDIT' = 'ADD';


  constructor(private appService: AppService,
              private zoneService: ZoneService,
              private delegateTypeService: DelegateTypeService,
              private router: Router,
              private route: ActivatedRoute) {
    super();
  }

  ngOnInit() {
    this.subscribe(
      // load selected event
      this.appService.selectedEvent.subscribe(event => {
        this.selectedEvent = event;

        // load data based on selected event
        this.subscribe(
          this.delegateTypeService.getList(this.selectedEvent.id).subscribe(res => {
            this.delegateTypes = res.delegate_types;
          }),
          this.zoneService.getList(this.selectedEvent.id).subscribe(res => {
            this.zones = res.zones;
          })
        );
      }),
    );

    this.initializePersonEdit();
  }

  initializePersonEdit() {
    this.personEdit = {
      id: 0,
      person_id: 0,
      first_name: '',
      last_name: '',
      lines: [],
      email_address: '',
      date_of_birth: null,
      position: '',
      details: '',
      skill: null,
      sector: null,
      member: null,
      country: null,
      organization: '',
      group_name: '',
      image: null,
      delegate_type: null,
      random_hash: '',
      qr_code: '',
      zones: [],
      custom_field_data: new Map<string, string>(),
    }
  }

  addPerson(): void {
    if (this.action === 'ADD') {
      this.people.push(this.personEdit);
    } else if (this.action === 'EDIT') {
      this.action = 'ADD';
    }
    this.initializePersonEdit();
  }

  removePerson(index: number) {
    this.people.splice(index, 1);
  }

  editPerson(pa: PersonAccreditationSummary) {
    this.personEdit = pa;
    this.action = 'EDIT';
  }

  printPreview(twoBadgesPerPage: boolean): void {

  }
}
