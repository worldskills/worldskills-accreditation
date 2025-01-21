import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {WsComponent} from "@worldskills/worldskills-angular-lib";
import {ZoneService} from "../../services/zone/zone.service";
import {Zone} from "../../types/zone";
import {Event} from "../../types/event";
import {PackageOptionService} from "../../services/package-option/package-option.service";
import {PackageOption} from "../../types/package-option";
import {NgForm} from "@angular/forms";

@Component({
  selector: 'app-package-options-form',
  templateUrl: './package-options-form.component.html',
  styleUrls: ['./package-options-form.component.css'],
  standalone: false
})
export class PackageOptionsFormComponent extends WsComponent implements OnInit {

  @Output() savePackageOptionZones: EventEmitter<{ option: PackageOption, zones: Zone[] }> = new EventEmitter<{
    option: PackageOption,
    zones: Zone[]
  }>();
  @Output() cancelForm: EventEmitter<void> = new EventEmitter<void>();
  @Input() selectedEvent: Event;
  @Input() packageOption: PackageOption;
  @ViewChild('form') form: NgForm;
  zones: Zone[];
  packageOptionSelectedZones: Zone[];

  constructor(private zoneService: ZoneService,
              private packageOptionService: PackageOptionService) {
    super();
  }

  ngOnInit(): void {
    this.subscribe(
      this.zoneService.getList(this.selectedEvent.id, {available_person_accreditation: true}).subscribe(res => {
        this.zones = res.zones;
      }),
      this.packageOptionService.getPackageOptionZones(this.packageOption.id).subscribe(res => {
        this.packageOptionSelectedZones = res.zones;
      })
    );
  }

  save(): void {
    this.savePackageOptionZones.emit({
      option: this.packageOption,
      zones: [...this.form.value.zones]
    });
  }

  cancel() {
    this.cancelForm.emit();
  }
}
