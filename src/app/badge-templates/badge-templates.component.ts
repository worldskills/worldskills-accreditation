import {Component, OnInit} from '@angular/core';
import {AppService} from "../../services/app/app.service";
import {WsComponent} from "@worldskills/worldskills-angular-lib";

@Component({
  selector: 'app-badge-templates',
  templateUrl: './badge-templates.component.html',
  styleUrls: ['./badge-templates.component.css'],
  standalone: false
})
export class BadgeTemplatesComponent extends WsComponent implements OnInit {

  constructor(private appService: AppService) {
    super();
  }

  ngOnInit(): void {
    this.appService.showMenuTabs.next(true);
  }
}
