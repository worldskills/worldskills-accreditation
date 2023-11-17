import {Component, OnInit} from '@angular/core';
import {WsComponent} from "@worldskills/worldskills-angular-lib";
import {Event} from "../../types/event";
import {AppService} from "../../services/app/app.service";
import {PackageOptionService} from "../../services/package-option/package-option.service";
import {PackageOption} from "../../types/package-option";

@Component({
  selector: 'app-package-options',
  templateUrl: './package-options.component.html',
  styleUrls: ['./package-options.component.css']
})
export class PackageOptionsComponent extends WsComponent implements OnInit {

  selectedEvent: Event;
  options: PackageOption[];
  loading = false;

  constructor(private appService: AppService,
              private packageOptionService: PackageOptionService) {
    super();
  }

  ngOnInit(): void {
    this.subscribe(
      this.appService.selectedEvent.subscribe(event => {
        this.selectedEvent = event;

        // load Package Options for selected event
        this.loading = true;
        this.subscribe(
          this.packageOptionService.getOptions(this.selectedEvent.id).subscribe(res => {
            this.options = res.options;
            this.loading = false;
          })
        );
      })
    )
  }

}
