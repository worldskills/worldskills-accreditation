import {Component, Input, SimpleChanges} from '@angular/core';
import {PersonAccreditationSummary} from "../../../types/person-accreditation-summary";
import {Event} from "../../../types/event";

declare var textFit: any;

@Component({
  selector: 'badge-default',
  templateUrl: './default.component.html',
  styleUrls: ['../../../styles/badge.css', './default.component.css'],
  standalone: false
})
export class DefaultComponent {
  @Input() pa: PersonAccreditationSummary;
  @Input() currentEvent: Event
  currentDate = new Date();
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
      setTimeout(() => {
        textFit(document.getElementsByClassName('ws-text-fit'), {alignVert: true, maxFontSize: 28});
        this.showComponent = true;
      }, 100);
    }, 100);
  }
}
