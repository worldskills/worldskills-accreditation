import {Component, OnInit} from '@angular/core';
import {WsComponent} from "@worldskills/worldskills-angular-lib";
import {ActivatedRoute, Router} from "@angular/router";
import {PersonAccreditationService} from "../../services/person-accreditation/person-accreditation.service";
import {Event} from "../../types/event";
import {AppService} from "../../services/app/app.service";
import {combineLatest, debounceTime, distinctUntilChanged, Subject} from "rxjs";
import {PersonAccreditation} from "../../types/person-accreditation";
import {environment} from "../../environments/environment";
import {DelegateType} from "../../types/delegate-type";
import {DelegateTypeService} from "../../services/delegate-type/delegate-type.service";
import {ZoneService} from "../../services/zone/zone.service";
import {Zone} from "../../types/zone";
import {Location} from "@angular/common";

@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.css']
})
export class PersonComponent extends WsComponent implements OnInit {

  readonly peopleURL = environment.worldskillsPeople;
  selectedEvent: Event;
  personAcr: PersonAccreditation;
  delegateTypes: DelegateType[];
  zones: Zone[];

  savingPersonAcr = false;
  badgeLinesChange: Subject<string> = new Subject<string>();

  constructor(private appService: AppService,
              private router: Router,
              private route: ActivatedRoute,
              private personAccreditationService: PersonAccreditationService,
              private delegateTypeService: DelegateTypeService,
              private zoneService: ZoneService,
              private location: Location
  ) {
    super();
  }

  ngOnInit(): void {
    this.appService.showMenuTabs.next(false);
    combineLatest([this.appService.selectedEvent, this.route.params])
      .subscribe(([event, {personAcrId}]) => {
        this.selectedEvent = event;
        this.subscribe(
          this.personAccreditationService.getPersonAccreditation(this.selectedEvent.id, personAcrId).subscribe(person => {
            this.personAcr = person;
          }),
          this.delegateTypeService.getList(this.selectedEvent.id).subscribe(res => {
            this.delegateTypes = res.delegate_types;
          }),
          this.zoneService.getList(this.selectedEvent.id).subscribe(res => {
            this.zones = res.zones;
          })
        );
      });

    // saving badge lines only when user stops typing for 400ms and when the lines have changed
    this.badgeLinesChange.pipe(debounceTime(400), distinctUntilChanged()).subscribe(lines => {
      this.personAcr.lines = lines;
      this.updatePersonAccreditation();
    });
  }

  updatePersonAccreditation(): void {
    this.savingPersonAcr = true;
    this.subscribe(
      this.personAccreditationService.updatePersonAccreditation(this.selectedEvent.id, this.personAcr.id, this.personAcr).subscribe(res => {
        this.personAcr = res;
        this.savingPersonAcr = false;
      })
    );
  }

  onDelTypeChange(dt: DelegateType) {
    this.personAcr.delegate_type = dt;
    this.updatePersonAccreditation();
  }

  onBadgeLinesChange(lines: string) {
    this.badgeLinesChange.next(lines);
  }

  private hasZone(zone: Zone): boolean {
    return this.personAcr.summary.zones.map(z => z.id).includes(zone.id);
  }

  getZonesToAdd(): Zone[] {
    return this.zones.filter(zone => !this.hasZone(zone));
  }

  getZonesToRemove(): Zone[] {
    return this.zones.filter(zone => this.hasZone(zone));
  }

  addZone(zone: Zone) {
    const removed = this.personAcr.zones_remove.find(z => z.id === zone.id);
    if (removed) {
      this.personAcr.zones_remove = this.personAcr.zones_remove.filter(z => z.id !== zone.id);
    } else {
      if (this.personAcr.zones_add == null) {
        this.personAcr.zones_add = [];
      }

      this.personAcr.zones_add.push(zone);
    }

    this.updatePersonAccreditation();
  }

  removeZone(zone: Zone) {
    const added = this.personAcr.zones_add.find(z => z.id === zone.id);
    if (added) {
      this.personAcr.zones_add = this.personAcr.zones_add.filter(z => z.id !== zone.id);
    } else {
      if (this.personAcr.zones_remove == null) {
        this.personAcr.zones_remove = [];
      }
      this.personAcr.zones_remove.push(zone);
    }

    this.updatePersonAccreditation();
  }

  printPreview(): void {
    const urlTree = this.router.createUrlTree(['../../print/' + this.personAcr.id], {relativeTo: this.route});
    const url = this.router.serializeUrl(urlTree);
    window.open(url, '_blank');
  }

  backToPeopleList(): void {
    this.location.back();
  }
}
