import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import {PersonAccreditationSummary} from "../../../types/person-accreditation-summary";
import {Event} from "../../../types/event";
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

  constructor(private zoneService: ZoneService) {
  }

  ngOnInit() {
    this.refreshComponent();
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
