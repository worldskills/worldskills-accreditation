import {Component, Input, SimpleChanges} from '@angular/core';
import {PersonAccreditationSummary} from "../../../types/person-accreditation-summary";
import {Event} from "../../../types/event";

declare var textFit: any;

@Component({
  selector: 'badge-wsi2025-ciw',
  templateUrl: './wsi2025-ciw.component.html',
  styleUrls: ['./wsi2025-ciw.component.css'],
  standalone: false
})
export class Wsi2025CiwComponent {
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
      this.showComponent = true;
      setTimeout(() => {
        textFit(document.getElementsByClassName('ws-text-fit-name'), {maxFontSize: 30});
        textFit(document.getElementsByClassName('ws-text-fit-lines'), {detectMultiLine: false, maxFontSize: 22});
      }, 100);
    }, 100);
  }

}
