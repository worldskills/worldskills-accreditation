import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Datetime, WsComponent} from "@worldskills/worldskills-angular-lib";
import {NgForm} from "@angular/forms";
import {PersonAccreditationScanReqParams} from "../../types/person-accreditation-scan";
import {DelegateType} from "../../types/delegate-type";
import {Member} from "../../types/member";
import {Skill} from "../../types/skill";
import {Zone} from "../../types/zone";
import {Event} from "../../types/event";
import {AppService} from "../../services/app/app.service";
import {DelegateTypeService} from "../../services/delegate-type/delegate-type.service";
import {MemberService} from "../../services/member/member.service";
import {SkillService} from "../../services/skill/skill.service";
import {ZoneService} from "../../services/zone/zone.service";
import {ScanService} from "../../services/scan/scan.service";

@Component({
  selector: 'app-scans-filter',
  templateUrl: './scans-filter.component.html',
  styleUrls: ['./scans-filter.component.css']
})
export class ScansFilterComponent extends WsComponent implements OnInit {

  @Output() filter = new EventEmitter<PersonAccreditationScanReqParams>();
  @Output() export = new EventEmitter<PersonAccreditationScanReqParams>();
  @Input() loading: boolean;
  @ViewChild('form') form: NgForm;

  fetchParams: PersonAccreditationScanReqParams;
  from: Datetime;
  to: Datetime;

  delegateTypes: DelegateType[];
  members: Member[];
  skills: Skill[];
  zones: Zone[];
  private selectedEvent: Event;

  constructor(private appService: AppService,
              private delegateTypeService: DelegateTypeService,
              private memberService: MemberService,
              private scanService: ScanService,
              private skillService: SkillService,
              private zoneService: ZoneService) {
    super();
  }

  ngOnInit(): void {
    this.subscribe(
      // load selected event
      this.appService.selectedEvent.subscribe(event => {
        this.selectedEvent = event;

        this.resetFilter(this.selectedEvent);
        this.submit();

        // load all filter options based on selected event
        this.subscribe(
          this.delegateTypeService.getList(this.selectedEvent.id, {available_person_accreditation: true}).subscribe(res => {
            this.delegateTypes = res.delegate_types;
          }),
          this.skillService.getSkills(this.selectedEvent.id).subscribe(res => {
            this.skills = res.skills.sort((a, b) => a.name.text.localeCompare(b.name.text));
          }),
          this.zoneService.getList(this.selectedEvent.id, {available_person_accreditation: true}).subscribe(res => {
            this.zones = res.zones;
          })
        );
      }),
      // load non-event based data
      this.memberService.getWSIMembers().subscribe(res => {
        this.members = res.members;
      })
    );
  }

  private resetFilter(selectedEvent: Event): void {
    this.fetchParams = this.scanService.initialiseFetchParams(selectedEvent);

    // set default date filter value
    const eventStart = new Date(selectedEvent.start_date);
    const eventEnd = new Date(selectedEvent.end_date);
    this.from = new Datetime({
      year: eventStart.getFullYear(),
      month: eventStart.getMonth() + 1,
      day: eventStart.getDate(),
      hour: 0,
      minute: 0,
      second: 0,
      timeZoneOffset: 0
    });
    this.to = new Datetime({
      year: eventEnd.getFullYear(),
      month: eventEnd.getMonth() + 1,
      day: eventEnd.getDate(),
      hour: 23,
      minute: 59,
      second: 59,
      timeZoneOffset: 0
    });
  }

  submit(): void {
    this.filter.emit(this.getFetchParams());
  }

  exportResult() {
    this.export.emit(this.getFetchParams());
  }

  private getFetchParams() {
    this.fetchParams.from = this.fixDateFormat(this.from.toString());
    this.fetchParams.to = this.fixDateFormat(this.to.toString());

    return {...this.fetchParams, ...this.form?.value};
  }

  private fixDateFormat(value: string): string {
    const regex = /\+\d{2}:\d{2}/;
    const offset = value.match(regex);
    if (offset) {
      return value.replace(regex, offset[0].replace(':', ''));
    } else {
      return value;
    }
  }


}
