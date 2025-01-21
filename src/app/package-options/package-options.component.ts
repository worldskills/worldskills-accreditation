import {Component, OnInit} from '@angular/core';
import {WsComponent} from "@worldskills/worldskills-angular-lib";
import {Event} from "../../types/event";
import {AppService} from "../../services/app/app.service";
import {PackageOptionService} from "../../services/package-option/package-option.service";
import {PackageOption} from "../../types/package-option";
import {Zone} from 'src/types/zone';
import {ToastService} from "angular-toastify";

@Component({
  selector: 'app-package-options',
  templateUrl: './package-options.component.html',
  styleUrls: ['./package-options.component.css'],
  standalone: false
})
export class PackageOptionsComponent extends WsComponent implements OnInit {

  selectedEvent: Event;
  options: PackageOption[];
  loading = false;
  managePackageOption: PackageOption = null;

  constructor(private appService: AppService,
              private packageOptionService: PackageOptionService,
              private toastService: ToastService
              ) {
    super();
  }

  ngOnInit(): void {
    this.appService.showMenuTabs.next(true);
    this.subscribe(
      this.appService.selectedEvent.subscribe(event => {
        this.selectedEvent = event;

        // load Package Options for selected event
        this.loading = true;
        this.subscribe(
          this.packageOptionService.getOptions(this.selectedEvent.id).subscribe(res => {
            this.options = res.options;
            this.loading = false;

            // load zones for each option
            this.options.forEach(option => {
              this.packageOptionService.getPackageOptionZones(option.id).subscribe(res => {
                option.zones = res.zones;
              });
            });
          })
        );
      })
    )
  }

  save(value: { option: PackageOption, zones: Zone[] }) {
    this.packageOptionService.updatePackageOptionZones(value.option.id, {zones: value.zones}).subscribe(res => {

      // update zones for the option
      this.options.find(o => o.id === value.option.id).zones = res.zones;

      this.managePackageOption = null;
      this.toastService.success('Package Option is saved!');
    });
  }

  updatePackageOption(option: PackageOption) {
    this.managePackageOption = option;
  }
}
