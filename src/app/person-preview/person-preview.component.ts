import {Component, Input, OnInit} from '@angular/core';
import {PersonAccreditation} from "../../types/person-accreditation";
import {WsComponent} from "@worldskills/worldskills-angular-lib";

@Component({
  selector: 'app-person-preview',
  templateUrl: './person-preview.component.html',
  styleUrls: ['./person-preview.component.css']
})
export class PersonPreviewComponent extends WsComponent implements OnInit {

  @Input() personAccreditation: PersonAccreditation;

  constructor() {
    super();
  }

  ngOnInit(): void {

  }
}
