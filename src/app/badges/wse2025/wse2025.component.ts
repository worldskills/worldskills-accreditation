import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import {PersonAccreditationSummary} from "../../../types/person-accreditation-summary";
import {Event} from "../../../types/event";
import {Zone} from "../../../types/zone";
import {ZoneService} from '../../../services/zone/zone.service';

declare var textFit: any;

@Component({
  selector: 'badge-wse2025',
  templateUrl: './wse2025.component.html',
  styleUrls: ['./wse2025.component.css'],
  standalone: false
})
export class Wse2025Component implements OnInit {

  @Input() pa: PersonAccreditationSummary;
  @Input() currentEvent: Event
  showComponent = true;
  zones: Zone[] = [];

  constructor(private zoneService: ZoneService) {
  }

  ngOnInit() {
    this.refreshComponent();
    this.zoneService.getList(this.currentEvent.id, {available_person_accreditation: true}).subscribe(res => {
      this.zones = res.zones;
    })
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['pa']) {
      this.refreshComponent();
    }
  }

  refreshComponent() {
    this.showComponent = false;
    setTimeout(() => {
      this.showComponent = true;
      setTimeout(() => {
        textFit(document.getElementsByClassName('ws-text-fit'), {multiLine: true});
      }, 100);
    }, 100);
  }

  hasZone(zone: string) {
    return this.pa.zones.map(z => z.code).includes(zone);
  }
}
