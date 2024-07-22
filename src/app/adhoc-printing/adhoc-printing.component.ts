import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {DelegateType} from "../../types/delegate-type";
import {WsComponent} from "@worldskills/worldskills-angular-lib";
import {AppService} from "../../services/app/app.service";
import {DelegateTypeService} from "../../services/delegate-type/delegate-type.service";
import {ZoneService} from "../../services/zone/zone.service";
import {Zone} from "../../types/zone";
import {Event} from "../../types/event";
import {PersonAccreditationSummary} from "../../types/person-accreditation-summary";
import * as XLSX from 'xlsx';
import {HttpClient} from "@angular/common/http";
import {share} from "rxjs";
import {createDownloadLink} from "../../utils/FileUtil";

@Component({
  selector: 'app-adhoc-printing',
  templateUrl: './adhoc-printing.component.html',
  styleUrls: ['./adhoc-printing.component.css']
})
export class AdhocPrintingComponent extends WsComponent implements OnInit {

  @Output() save: EventEmitter<PersonAccreditationSummary[]> = new EventEmitter<PersonAccreditationSummary[]>();
  @Input() people: PersonAccreditationSummary[] = [];
  selectedEvent: Event;
  delegateTypes: DelegateType[];
  badgeLines: string = '';
  zones: Zone[];
  personEdit: PersonAccreditationSummary;
  personEditIndex: number;

  action: 'ADD' | 'EDIT' = 'ADD';

  constructor(private appService: AppService,
              private zoneService: ZoneService,
              private delegateTypeService: DelegateTypeService,
              private http: HttpClient) {
    super();
  }

  ngOnInit() {
    this.subscribe(
      // load selected event
      this.appService.selectedEvent.subscribe(event => {
        this.selectedEvent = event;

        // load data based on selected event
        this.subscribe(
          this.delegateTypeService.getList(this.selectedEvent.id, {available_person_accreditation: true}).subscribe(res => {
            this.delegateTypes = res.delegate_types;
          }),
          this.zoneService.getList(this.selectedEvent.id, {available_person_accreditation: true}).subscribe(res => {
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
      host_info_status: null,
      random_hash: '',
      qr_code: '',
      zones: [],
      custom_field_data: new Map<string, string>(),
    }
  }

  savePerson(): void {
    this.personEdit.lines = this.badgeLines.split('\n');
    if (this.action === 'ADD') {
      this.people.push(this.personEdit);
    } else if (this.action === 'EDIT') {
      this.people[this.personEditIndex] = this.personEdit;
      this.action = 'ADD';
    }
    this.initializePersonEdit();

    this.savePeople();
  }

  removePerson(index: number) {
    this.people.splice(index, 1);

    this.savePeople();
  }

  editPerson(index: number) {
    this.personEdit = JSON.parse(JSON.stringify(this.people[index]));
    this.personEditIndex = index;
    this.badgeLines = '';
    this.badgeLines = this.personEdit.lines.join('\n');
    this.action = 'EDIT';
  }

  savePeople(): void {
    this.save.emit(this.people);
  }

  handleFileInput(event: any): void {
    const file = event.target.files[0];

    if (file) {
      this.readExcelFile(file);
    }
  }

  readExcelFile(file: File): void {
    const reader: FileReader = new FileReader();

    reader.onload = (e: any) => {
      const data: ArrayBuffer = e.target.result;
      const workbook: XLSX.WorkBook = XLSX.read(data, {type: 'array'});

      // Get the first worksheet
      const sheetName: string = workbook.SheetNames[0];
      const worksheet: XLSX.WorkSheet = workbook.Sheets[sheetName];

      // Convert the worksheet to a JSON object
      const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, {raw: true});

      // loop through the rows and add to the people array
      for (const d of jsonData) {
        const firstname = d["First Name"] ?? "";
        const lastname = d["Last Name"] ?? "";
        const badgeLines: string = d["Badge Lines"] ?? "";
        const delegateType = d["Delegate Type"] ?? null;

        const delType = this.delegateTypes.find(dt => dt.name === delegateType) ?? null;

        this.people.push({
          first_name: firstname,
          last_name: lastname,
          lines: badgeLines.split('\n'),
          delegate_type: delType,
          id: null,
          person_id: null,
          email_address: null,
          date_of_birth: null,
          position: null,
          details: null,
          skill: null,
          sector: null,
          member: null,
          country: null,
          organization: null,
          group_name: null,
          image: null,
          host_info_status: null,
          random_hash: null,
          qr_code: null,
          zones: [],
          custom_field_data: new Map<string, string>(),
        });
      }
    };

    reader.readAsArrayBuffer(file);
  }


  downloadExcelTemplate(): void {
    this.http.get(`assets/import_adhoc_template.xlsx`, {responseType: 'blob'}).pipe(share()).subscribe(res => {
      createDownloadLink(res, 'import_adhoc_template.xlsx');
    });
  }
}
