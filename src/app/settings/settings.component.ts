import {Component, OnInit} from '@angular/core';
import {WsComponent} from "@worldskills/worldskills-angular-lib";
import {AppService} from "../../services/app/app.service";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent extends WsComponent implements OnInit {

  badgePerPage: number;

  constructor(private appService: AppService) {
    super();
  }

  ngOnInit(): void {
    this.appService.badgePerPage.subscribe(badgePerPage => {
      this.badgePerPage = badgePerPage;
    });
  }

  changeBadgePerPage(selected: number) {
    this.appService.badgePerPage.next(selected);
  }
}
