import {Component, Input, SimpleChanges} from '@angular/core';
import {PersonAccreditationSummary} from "../../../types/person-accreditation-summary";
import {Event} from "../../../types/event";

declare var textFit: any;

@Component({
  selector: 'badge-base', // TODO: Change the selector to match the name of the badge
  templateUrl: './base.component.html',
  styleUrls: ['../../../styles/badge.css'] // TODO: If the badge has a different style, change the path to the correct file
})
export class BaseComponent {

  @Input() pa: PersonAccreditationSummary;
  @Input() currentEvent: Event;

  // these are the inputs that are used to determine the layout of the multiple badges
  @Input() twoBadgesPerPage: boolean;
  @Input() index: number;
  @Input() totalBadgesToPrint: number;

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

  // this makes the font size smaller for long lines if necessary
  refreshComponent() {
    this.showComponent = false;
    setTimeout(() => {
      this.showComponent = true;
      setTimeout(() => {
        textFit(document.getElementsByClassName('ws-text-fit'), {multiLine: true});
      }, 100);
    }, 100);
  }
}
