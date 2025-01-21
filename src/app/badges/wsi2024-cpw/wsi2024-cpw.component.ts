import {Component, Input, SimpleChanges} from '@angular/core';
import {PersonAccreditationSummary} from "../../../types/person-accreditation-summary";
import {Event} from "../../../types/event";

declare var textFit: any;

@Component({
  selector: 'badge-wsi2024-cpw',
  templateUrl: './wsi2024-cpw.component.html',
  styleUrls: ['./wsi2024-cpw.component.css'],
  standalone: false
})
export class Wsi2024CpwComponent {
  @Input() pa: PersonAccreditationSummary;
  @Input() currentEvent: Event
  showComponent = true;

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

  hasFirstZone(zones: any) {
    for (const zone in zones) {
      if (this.hasZone(zone)) {
        return zones[zone];
      }
    }
    return false;
  }

  hasAnyZone(zones: string[]) {
    for (const zone of zones) {
      if (this.hasZone(zone)) {
        return true;
      }
    }
    return false;
  }

  hasZone(zone: string) {
    return this.pa.zones.map(z => z.code).includes(zone);
  }
}
