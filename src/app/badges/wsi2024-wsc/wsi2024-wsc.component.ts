import {Component, Input, SimpleChanges} from '@angular/core';
import {PersonAccreditationSummary} from "../../../types/person-accreditation-summary";
import {Event} from "../../../types/event";

declare var textFit: any;

@Component({
  selector: 'badge-wsi2024-wsc',
  templateUrl: './wsi2024-wsc.component.html',
  styleUrls: ['./wsi2024-wsc.component.css']
})
export class Wsi2024WscComponent {
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
        textFit(document.getElementsByClassName('ws-text-fit'), {alignVert: true});
      }, 100);
    }, 100);
  }

  hasZone(zone: string) {
    return this.pa.zones.map(z => z.code).includes(zone);
  }

  hasAnyZone(zones: string[]) {
    for (const zone of zones) {
      if (this.hasZone(zone)) {
        return true;
      }
    }
    return false;
  }
}
