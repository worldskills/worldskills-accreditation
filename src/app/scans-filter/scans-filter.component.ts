import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {WsComponent} from "@worldskills/worldskills-angular-lib";
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

@Component({
  selector: 'app-scans-filter',
  templateUrl: './scans-filter.component.html',
  styleUrls: ['./scans-filter.component.css']
})
export class ScansFilterComponent extends WsComponent implements OnInit {

  @Output() filter = new EventEmitter<PersonAccreditationScanReqParams>();
  @ViewChild('form') form: NgForm;

  fetchParams: PersonAccreditationScanReqParams;
  delegateTypes: DelegateType[];
  members: Member[];
  skills: Skill[];
  zones: Zone[];
  private selectedEvent: Event;

  constructor(private appService: AppService,
              private delegateTypeService: DelegateTypeService,
              private memberService: MemberService,
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

        // load all filter options based on selected event
        this.subscribe(
          this.delegateTypeService.getList(this.selectedEvent.id).subscribe(res => {
            this.delegateTypes = res.delegate_types;
          }),
          this.skillService.getSkills(this.selectedEvent.id).subscribe(res => {
            this.skills = res.skills.sort((a, b) => a.name.text.localeCompare(b.name.text));
          }),
          this.zoneService.getList(this.selectedEvent.id).subscribe(res => {
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
    this.fetchParams = {
      from: null,
      to: null,
      eventId: selectedEvent.id,
      zone: null,
      delegate_type: null,
      member: null,
      accreditation: null
    }
  }

  submit(): void {
    this.filter.emit({...this.fetchParams, ...this.form.value});
  }
}
