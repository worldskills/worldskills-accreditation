import {Component, Input, SimpleChanges} from '@angular/core';
import {Event} from "../../types/event";
import { VehicleAccreditation } from 'src/types/vehicle-accreditation';

declare var textFit: any;

@Component({
  selector: 'app-vehicle-badge',
  templateUrl: './vehicle-badge.component.html',
  styleUrls: ['./vehicle-badge.component.css'],
  standalone: false
})
export class VehicleBadgeComponent {

  @Input() vehicle: VehicleAccreditation;
  @Input() selectedEvent: Event;
  showComponent = true;

  ngOnInit() {
    this.refreshComponent();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['vehicle']) {
      this.refreshComponent();
    }
  }

  refreshComponent() {
    this.showComponent = false;
    setTimeout(() => {
      this.showComponent = true;
      setTimeout(() => {
        textFit(document.getElementsByClassName('ws-text-fit'));
      }, 100);
    }, 100);
  }

  hasZone(zone: string) {
    return this.vehicle.zones.map(z => z.code).includes(zone);
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
