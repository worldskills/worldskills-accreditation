import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {WsComponent} from "@worldskills/worldskills-angular-lib";
import {PersonAccreditationSummaryReqParams} from "../../types/person-accreditation-summary";
import {DelegateType} from "../../types/delegate-type";
import {DelegateTypeService} from "../../services/delegate-type/delegate-type.service";
import {Event} from "../../types/event";
import {AppService} from "../../services/app/app.service";
import {MemberService} from "../../services/member/member.service";
import {Member} from "../../types/member";
import {SkillService} from "../../services/skill/skill.service";
import {Skill} from "../../types/skill";
import {ZoneService} from "../../services/zone/zone.service";
import {Zone} from 'src/types/zone';
import {NgForm} from "@angular/forms";

@Component({
  selector: 'app-people-filter',
  templateUrl: './people-filter.component.html',
  styleUrls: ['./people-filter.component.css']
})
export class PeopleFilterComponent extends WsComponent implements OnInit {

  @Output() filter = new EventEmitter<PersonAccreditationSummaryReqParams>();
  @ViewChild('form') form: NgForm;

  fetchParams: PersonAccreditationSummaryReqParams;
  delegateTypes: DelegateType[];
  members: Member[];
  skills: Skill[];
  zones: Zone[];
  yesNoSelections = [
    {value: true, label: 'Yes'},
    {value: false, label: 'No'},
  ]
  private selectedEvent: Event;

  constructor(private appService: AppService,
              private delegateTypeService: DelegateTypeService,
              private memberService: MemberService,
              private skillService: SkillService,
              private zoneService: ZoneService) {
    super();
  }

  ngOnInit(): void {
    this.resetFilter();
    this.subscribe(
      // load selected event
      this.appService.selectedEvent.subscribe(event => {
        this.selectedEvent = event;

        // load all filter options based on selected event
        this.subscribe(
          this.delegateTypeService.getDelegateTypes(this.selectedEvent.id).subscribe(res => {
            this.delegateTypes = res.delegate_types;
          }),
          this.skillService.getSkills(this.selectedEvent.id).subscribe(res => {
            this.skills = res.skills.sort((a, b) => a.name.text.localeCompare(b.name.text));
          }),
          this.zoneService.getZones(this.selectedEvent.id).subscribe(res => {
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

  resetFilter(): void {
    this.fetchParams = {
      name: null,
      country: null,
      member: null,
      pos_id: null,
      pos_name: null,
      skill: null,
      group: null,
      zone: [],
      printed: null,
      photo: null,
      del_types: [],
      offset: 0,
      limit: 10
    };
  }

  submit(): void {
    this.filter.emit({...this.fetchParams, ...this.form.value});
  }
}
