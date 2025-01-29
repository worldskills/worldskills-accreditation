import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
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
import {ActivatedRoute, Params, Router} from "@angular/router";
import {PersonAccreditationService} from "../../services/person-accreditation/person-accreditation.service";
import {PeopleSearchFunctionalitiesDisplaySetting} from "../people/people.component";

@Component({
  selector: 'app-people-filter',
  templateUrl: './people-filter.component.html',
  styleUrls: ['./people-filter.component.css'],
  standalone: false
})
export class PeopleFilterComponent extends WsComponent implements OnInit {

  @Output() filter = new EventEmitter<PersonAccreditationSummaryReqParams>();
  @Output() clear = new EventEmitter();
  @Input() fetchParams: PersonAccreditationSummaryReqParams;
  @Input() hasPrintPermission: boolean;
  @Input() functionalitiesDisplaySetting: PeopleSearchFunctionalitiesDisplaySetting;
  @ViewChild('form') form: NgForm;

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
              private zoneService: ZoneService,
              private personAcrService: PersonAccreditationService,
              private router: Router,
              private route: ActivatedRoute) {
    super();
  }

  ngOnInit(): void {
    this.subscribe(
      // load selected event
      this.appService.selectedEvent.subscribe(event => {
        this.selectedEvent = event;

        // load all filter options based on selected event
        this.subscribe(
          this.delegateTypeService.getList(this.selectedEvent.id, {available_person_accreditation: true}).subscribe(res => {
            this.delegateTypes = res.delegate_types;
          }),
          this.skillService.getSkills(this.selectedEvent.id).subscribe(res => {
            this.skills = res.skills;
            // combined label
            this.skills.forEach(skill => {
              skill.label = `${skill.skill_number} ${skill.name.text}`;
            });
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

  submit(): void {
    this.filter.emit({...this.fetchParams, ...this.form.value});
  }

  clearFilter(event: any): void {
    event.preventDefault();
    this.clear.emit();
  }

  printPreview(twoBadgesPerPage: boolean): void {
    this.submit();
    this.fetchParams = {...this.fetchParams, ...this.form.value};

    const queryParams: Params = this.personAcrService.buildQueryParams(this.fetchParams);
    queryParams['offset'] = 0;
    queryParams['limit'] = 9999;
    queryParams['twoBadgesPerPage'] = twoBadgesPerPage;

    const urlTree = this.router.createUrlTree(['../print'], {relativeTo: this.route, queryParams});
    const url = this.router.serializeUrl(urlTree);
    window.open(url, '_blank');
  }
}
