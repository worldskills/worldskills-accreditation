import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {WsComponent} from "@worldskills/worldskills-angular-lib";
import {AppService} from "../../services/app/app.service";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {PersonAccreditationSummary} from "../../types/person-accreditation-summary";
import {Event} from "../../types/event";
import {EventService} from "../../services/event/event.service";
import {ActivatedRoute} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";
import {BadgeTemplateService} from "../../services/badge-template/badge-template.service";


@Component({
  selector: 'app-print',
  templateUrl: './print.component.html',
  styleUrls: ['../../styles/badge.css'],
  encapsulation: ViewEncapsulation.None
})
export class PrintComponent extends WsComponent implements OnInit {

  currentEvent: Event;
  people: PersonAccreditationSummary[] = [
    {
      "id": 22363,
      "person_id": 9273,
      "first_name": "Hiroshi",
      "last_name": "Akimoto",
      "lines": [
        "Official Delegate",
        "Japan",
        ""
      ],
      "email_address": "hi-akimoto@javada.or.jp",
      "date_of_birth": null,
      "delegate_type": {
        "id": 178,
        "code": "OD",
        "name": "Official Delegate",
        "line1": "POSITION",
        "line2": "MEMBER",
        "line3": "",
        "color": "#72D0EB",
        "zones": [
          {
            "id": 118,
            "code": "GA",
            "name": "GA meeting",
            "color": "#0084AD",
            "text_color": "#fff",
            "sort": 1
          },
          {
            "id": 119,
            "code": "SDC",
            "name": "SDC meeting",
            "color": "#72D0EB",
            "text_color": "#000",
            "sort": 3
          },
          {
            "id": 120,
            "code": "CC",
            "name": "CC meeting",
            "color": "#8AE2D1",
            "text_color": "#000",
            "sort": 4
          },
          {
            "id": 121,
            "code": "C",
            "name": "Conference",
            "color": "#D51067",
            "text_color": "#fff",
            "sort": 5
          }
        ],
        "text_color": "#000"
      },
      "position": "Official Delegate",
      "skill": null,
      "sector": null,
      "member": {
        "id": 14,
        "name": {
          "lang_code": "en",
          "text": "Japan"
        },
        "code": "JP"
      },
      "country": {
        "id": 107,
        "code": "JP",
        "name": {
          "lang_code": "en",
          "text": "Japan"
        }
      },
      "organization": null,
      "image": {
        "id": 6787,
        "thumbnail_hash": "dce60b66-ef94-4686-a462-65aa045e3c9d",
        "thumbnail": "https://images.worldskillsusercontent.show/wsdc/wse6/6787/wsdce60b66-ef94-4686-a462-65aa045e3c9d",
        "type": "TEAM",
      },
      "random_hash": "OOELCO",
      "zones": [
        {
          "id": 118,
          "code": "GA",
          "name": "GA meeting",
          "color": "#0084AD",
          "text_color": "#fff",
          "sort": 1
        },
        {
          "id": 119,
          "code": "SDC",
          "name": "SDC meeting",
          "color": "#72D0EB",
          "text_color": "#000",
          "sort": 3
        },
        {
          "id": 120,
          "code": "CC",
          "name": "CC meeting",
          "color": "#8AE2D1",
          "text_color": "#000",
          "sort": 4
        },
        {
          "id": 121,
          "code": "C",
          "name": "Conference",
          "color": "#D51067",
          "text_color": "#fff",
          "sort": 5
        }
      ],
      "custom_field_data": null,
      "details": null,
      "group_name": "Japan",
      "qr_code": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPAAAADwAQAAAAAWLtQ/AAABIUlEQVR42u3ZsRGDMAwFUOUoKBmBUTJaGI1RGCElBYdiyTY2R+CMIJfmuyJ+VB+fLDvEh4N+ym+K4+V+9uTen5apFmzjh093cjwT1UztpG9K4mAz95LuFDPXR/kSNfgOnukZ4gffyHEhg69yrA7rNb0pHuByTvuYsM/86zYHLua8v3LVYXRzew0ZuJRlIY/EA8WSwEPFXQO+ylIHQuZ+tms0frCR04FAMndMVClL/GAzZ5m7IQuZ45cA29inm6rD0nz5fQxs4TR8x6XVgWi1kMHneH3fkvcJDDZzdjYI71WauTZfYCvnp6zQfO1cYoFPs888dlzLdSv4Cud9AvsDLdjK2R221Fm3kKnRR7CVs/uWcMkifQJttzlwMf/zT8dj/gDmbyuhyH+wegAAAABJRU5ErkJggg=="
    },
    {
      "id": 22363,
      "person_id": 9273,
      "first_name": "Hiroshi 2",
      "last_name": "Akimoto",
      "lines": [
        "Official Delegate",
        "Japan",
        ""
      ],
      "email_address": "hi-akimoto@javada.or.jp",
      "date_of_birth": null,
      "delegate_type": {
        "id": 178,
        "code": "OD",
        "name": "Official Delegate",
        "line1": "POSITION",
        "line2": "MEMBER",
        "line3": "",
        "color": "#72D0EB",
        "zones": [
          {
            "id": 118,
            "code": "GA",
            "name": "GA meeting",
            "color": "#0084AD",
            "text_color": "#fff",
            "sort": 1
          },
          {
            "id": 119,
            "code": "SDC",
            "name": "SDC meeting",
            "color": "#72D0EB",
            "text_color": "#000",
            "sort": 3
          },
          {
            "id": 120,
            "code": "CC",
            "name": "CC meeting",
            "color": "#8AE2D1",
            "text_color": "#000",
            "sort": 4
          },
          {
            "id": 121,
            "code": "C",
            "name": "Conference",
            "color": "#D51067",
            "text_color": "#fff",
            "sort": 5
          }
        ],
        "text_color": "#000"
      },
      "position": "Official Delegate",
      "skill": null,
      "sector": null,
      "member": {
        "id": 14,
        "name": {
          "lang_code": "en",
          "text": "Japan"
        },
        "code": "JP"
      },
      "country": {
        "id": 107,
        "code": "JP",
        "name": {
          "lang_code": "en",
          "text": "Japan"
        }
      },
      "organization": null,
      "image": {
        "id": 6787,
        "thumbnail_hash": "dce60b66-ef94-4686-a462-65aa045e3c9d",
        "thumbnail": "https://images.worldskillsusercontent.show/wsdc/wse6/6787/wsdce60b66-ef94-4686-a462-65aa045e3c9d",
        "type": "TEAM",
      },
      "random_hash": "OOELCO",
      "zones": [
        {
          "id": 118,
          "code": "GA",
          "name": "GA meeting",
          "color": "#0084AD",
          "text_color": "#fff",
          "sort": 1
        },
        {
          "id": 119,
          "code": "SDC",
          "name": "SDC meeting",
          "color": "#72D0EB",
          "text_color": "#000",
          "sort": 3
        },
        {
          "id": 120,
          "code": "CC",
          "name": "CC meeting",
          "color": "#8AE2D1",
          "text_color": "#000",
          "sort": 4
        },
        {
          "id": 121,
          "code": "C",
          "name": "Conference",
          "color": "#D51067",
          "text_color": "#fff",
          "sort": 5
        }
      ],
      "custom_field_data": null,
      "details": null,
      "group_name": "Japan",
      "qr_code": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPAAAADwAQAAAAAWLtQ/AAABIUlEQVR42u3ZsRGDMAwFUOUoKBmBUTJaGI1RGCElBYdiyTY2R+CMIJfmuyJ+VB+fLDvEh4N+ym+K4+V+9uTen5apFmzjh093cjwT1UztpG9K4mAz95LuFDPXR/kSNfgOnukZ4gffyHEhg69yrA7rNb0pHuByTvuYsM/86zYHLua8v3LVYXRzew0ZuJRlIY/EA8WSwEPFXQO+ylIHQuZ+tms0frCR04FAMndMVClL/GAzZ5m7IQuZ45cA29inm6rD0nz5fQxs4TR8x6XVgWi1kMHneH3fkvcJDDZzdjYI71WauTZfYCvnp6zQfO1cYoFPs888dlzLdSv4Cud9AvsDLdjK2R221Fm3kKnRR7CVs/uWcMkifQJttzlwMf/zT8dj/gDmbyuhyH+wegAAAABJRU5ErkJggg=="
    },
    {
      "id": 22363,
      "person_id": 9273,
      "first_name": "Hiroshi 2",
      "last_name": "Akimoto",
      "lines": [
        "Official Delegate",
        "Japan",
        ""
      ],
      "email_address": "hi-akimoto@javada.or.jp",
      "date_of_birth": null,
      "delegate_type": {
        "id": 178,
        "code": "OD",
        "name": "Official Delegate",
        "line1": "POSITION",
        "line2": "MEMBER",
        "line3": "",
        "color": "#72D0EB",
        "zones": [
          {
            "id": 118,
            "code": "GA",
            "name": "GA meeting",
            "color": "#0084AD",
            "text_color": "#fff",
            "sort": 1
          },
          {
            "id": 119,
            "code": "SDC",
            "name": "SDC meeting",
            "color": "#72D0EB",
            "text_color": "#000",
            "sort": 3
          },
          {
            "id": 120,
            "code": "CC",
            "name": "CC meeting",
            "color": "#8AE2D1",
            "text_color": "#000",
            "sort": 4
          },
          {
            "id": 121,
            "code": "C",
            "name": "Conference",
            "color": "#D51067",
            "text_color": "#fff",
            "sort": 5
          }
        ],
        "text_color": "#000"
      },
      "position": "Official Delegate",
      "skill": null,
      "sector": null,
      "member": {
        "id": 14,
        "name": {
          "lang_code": "en",
          "text": "Japan"
        },
        "code": "JP"
      },
      "country": {
        "id": 107,
        "code": "JP",
        "name": {
          "lang_code": "en",
          "text": "Japan"
        }
      },
      "organization": null,
      "image": {
        "id": 6787,
        "thumbnail_hash": "dce60b66-ef94-4686-a462-65aa045e3c9d",
        "thumbnail": "https://images.worldskillsusercontent.show/wsdc/wse6/6787/wsdce60b66-ef94-4686-a462-65aa045e3c9d",
        "type": "TEAM",
      },
      "random_hash": "OOELCO",
      "zones": [
        {
          "id": 118,
          "code": "GA",
          "name": "GA meeting",
          "color": "#0084AD",
          "text_color": "#fff",
          "sort": 1
        },
        {
          "id": 119,
          "code": "SDC",
          "name": "SDC meeting",
          "color": "#72D0EB",
          "text_color": "#000",
          "sort": 3
        },
        {
          "id": 120,
          "code": "CC",
          "name": "CC meeting",
          "color": "#8AE2D1",
          "text_color": "#000",
          "sort": 4
        },
        {
          "id": 121,
          "code": "C",
          "name": "Conference",
          "color": "#D51067",
          "text_color": "#fff",
          "sort": 5
        }
      ],
      "custom_field_data": null,
      "details": null,
      "group_name": "Japan",
      "qr_code": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPAAAADwAQAAAAAWLtQ/AAABIUlEQVR42u3ZsRGDMAwFUOUoKBmBUTJaGI1RGCElBYdiyTY2R+CMIJfmuyJ+VB+fLDvEh4N+ym+K4+V+9uTen5apFmzjh093cjwT1UztpG9K4mAz95LuFDPXR/kSNfgOnukZ4gffyHEhg69yrA7rNb0pHuByTvuYsM/86zYHLua8v3LVYXRzew0ZuJRlIY/EA8WSwEPFXQO+ylIHQuZ+tms0frCR04FAMndMVClL/GAzZ5m7IQuZ45cA29inm6rD0nz5fQxs4TR8x6XVgWi1kMHneH3fkvcJDDZzdjYI71WauTZfYCvnp6zQfO1cYoFPs888dlzLdSv4Cud9AvsDLdjK2R221Fm3kKnRR7CVs/uWcMkifQJttzlwMf/zT8dj/gDmbyuhyH+wegAAAABJRU5ErkJggg=="
    },
    {
      "id": 22363,
      "person_id": 9273,
      "first_name": "Hiroshi 2",
      "last_name": "Akimoto",
      "lines": [
        "Official Delegate",
        "Japan",
        ""
      ],
      "email_address": "hi-akimoto@javada.or.jp",
      "date_of_birth": null,
      "delegate_type": {
        "id": 178,
        "code": "OD",
        "name": "Official Delegate",
        "line1": "POSITION",
        "line2": "MEMBER",
        "line3": "",
        "color": "#72D0EB",
        "zones": [
          {
            "id": 118,
            "code": "GA",
            "name": "GA meeting",
            "color": "#0084AD",
            "text_color": "#fff",
            "sort": 1
          },
          {
            "id": 119,
            "code": "SDC",
            "name": "SDC meeting",
            "color": "#72D0EB",
            "text_color": "#000",
            "sort": 3
          },
          {
            "id": 120,
            "code": "CC",
            "name": "CC meeting",
            "color": "#8AE2D1",
            "text_color": "#000",
            "sort": 4
          },
          {
            "id": 121,
            "code": "C",
            "name": "Conference",
            "color": "#D51067",
            "text_color": "#fff",
            "sort": 5
          }
        ],
        "text_color": "#000"
      },
      "position": "Official Delegate",
      "skill": null,
      "sector": null,
      "member": {
        "id": 14,
        "name": {
          "lang_code": "en",
          "text": "Japan"
        },
        "code": "JP"
      },
      "country": {
        "id": 107,
        "code": "JP",
        "name": {
          "lang_code": "en",
          "text": "Japan"
        }
      },
      "organization": null,
      "image": {
        "id": 6787,
        "thumbnail_hash": "dce60b66-ef94-4686-a462-65aa045e3c9d",
        "thumbnail": "https://images.worldskillsusercontent.show/wsdc/wse6/6787/wsdce60b66-ef94-4686-a462-65aa045e3c9d",
        "type": "TEAM",
      },
      "random_hash": "OOELCO",
      "zones": [
        {
          "id": 118,
          "code": "GA",
          "name": "GA meeting",
          "color": "#0084AD",
          "text_color": "#fff",
          "sort": 1
        },
        {
          "id": 119,
          "code": "SDC",
          "name": "SDC meeting",
          "color": "#72D0EB",
          "text_color": "#000",
          "sort": 3
        },
        {
          "id": 120,
          "code": "CC",
          "name": "CC meeting",
          "color": "#8AE2D1",
          "text_color": "#000",
          "sort": 4
        },
        {
          "id": 121,
          "code": "C",
          "name": "Conference",
          "color": "#D51067",
          "text_color": "#fff",
          "sort": 5
        }
      ],
      "custom_field_data": null,
      "details": null,
      "group_name": "Japan",
      "qr_code": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPAAAADwAQAAAAAWLtQ/AAABIUlEQVR42u3ZsRGDMAwFUOUoKBmBUTJaGI1RGCElBYdiyTY2R+CMIJfmuyJ+VB+fLDvEh4N+ym+K4+V+9uTen5apFmzjh093cjwT1UztpG9K4mAz95LuFDPXR/kSNfgOnukZ4gffyHEhg69yrA7rNb0pHuByTvuYsM/86zYHLua8v3LVYXRzew0ZuJRlIY/EA8WSwEPFXQO+ylIHQuZ+tms0frCR04FAMndMVClL/GAzZ5m7IQuZ45cA29inm6rD0nz5fQxs4TR8x6XVgWi1kMHneH3fkvcJDDZzdjYI71WauTZfYCvnp6zQfO1cYoFPs888dlzLdSv4Cud9AvsDLdjK2R221Fm3kKnRR7CVs/uWcMkifQJttzlwMf/zT8dj/gDmbyuhyH+wegAAAABJRU5ErkJggg=="
    },
    {
      "id": 22363,
      "person_id": 9273,
      "first_name": "Hiroshi 2",
      "last_name": "Akimoto",
      "lines": [
        "Official Delegate",
        "Japan",
        ""
      ],
      "email_address": "hi-akimoto@javada.or.jp",
      "date_of_birth": null,
      "delegate_type": {
        "id": 178,
        "code": "OD",
        "name": "Official Delegate",
        "line1": "POSITION",
        "line2": "MEMBER",
        "line3": "",
        "color": "#72D0EB",
        "zones": [
          {
            "id": 118,
            "code": "GA",
            "name": "GA meeting",
            "color": "#0084AD",
            "text_color": "#fff",
            "sort": 1
          },
          {
            "id": 119,
            "code": "SDC",
            "name": "SDC meeting",
            "color": "#72D0EB",
            "text_color": "#000",
            "sort": 3
          },
          {
            "id": 120,
            "code": "CC",
            "name": "CC meeting",
            "color": "#8AE2D1",
            "text_color": "#000",
            "sort": 4
          },
          {
            "id": 121,
            "code": "C",
            "name": "Conference",
            "color": "#D51067",
            "text_color": "#fff",
            "sort": 5
          }
        ],
        "text_color": "#000"
      },
      "position": "Official Delegate",
      "skill": null,
      "sector": null,
      "member": {
        "id": 14,
        "name": {
          "lang_code": "en",
          "text": "Japan"
        },
        "code": "JP"
      },
      "country": {
        "id": 107,
        "code": "JP",
        "name": {
          "lang_code": "en",
          "text": "Japan"
        }
      },
      "organization": null,
      "image": {
        "id": 6787,
        "thumbnail_hash": "dce60b66-ef94-4686-a462-65aa045e3c9d",
        "thumbnail": "https://images.worldskillsusercontent.show/wsdc/wse6/6787/wsdce60b66-ef94-4686-a462-65aa045e3c9d",
        "type": "TEAM",
      },
      "random_hash": "OOELCO",
      "zones": [
        {
          "id": 118,
          "code": "GA",
          "name": "GA meeting",
          "color": "#0084AD",
          "text_color": "#fff",
          "sort": 1
        },
        {
          "id": 119,
          "code": "SDC",
          "name": "SDC meeting",
          "color": "#72D0EB",
          "text_color": "#000",
          "sort": 3
        },
        {
          "id": 120,
          "code": "CC",
          "name": "CC meeting",
          "color": "#8AE2D1",
          "text_color": "#000",
          "sort": 4
        },
        {
          "id": 121,
          "code": "C",
          "name": "Conference",
          "color": "#D51067",
          "text_color": "#fff",
          "sort": 5
        }
      ],
      "custom_field_data": null,
      "details": null,
      "group_name": "Japan",
      "qr_code": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPAAAADwAQAAAAAWLtQ/AAABIUlEQVR42u3ZsRGDMAwFUOUoKBmBUTJaGI1RGCElBYdiyTY2R+CMIJfmuyJ+VB+fLDvEh4N+ym+K4+V+9uTen5apFmzjh093cjwT1UztpG9K4mAz95LuFDPXR/kSNfgOnukZ4gffyHEhg69yrA7rNb0pHuByTvuYsM/86zYHLua8v3LVYXRzew0ZuJRlIY/EA8WSwEPFXQO+ylIHQuZ+tms0frCR04FAMndMVClL/GAzZ5m7IQuZ45cA29inm6rD0nz5fQxs4TR8x6XVgWi1kMHneH3fkvcJDDZzdjYI71WauTZfYCvnp6zQfO1cYoFPs888dlzLdSv4Cud9AvsDLdjK2R221Fm3kKnRR7CVs/uWcMkifQJttzlwMf/zT8dj/gDmbyuhyH+wegAAAABJRU5ErkJggg=="
    },
  ]
  badgeHTMLTemplate: string;

  constructor(private eventService: EventService,
              private route: ActivatedRoute,
              private appService: AppService,
              private sanitizer: DomSanitizer,
              private translate: TranslateService,
              private badgeTemplateService: BadgeTemplateService) {
    super();
  }

  ngOnInit(): void {
    // remove header, footer, breadcrumb, etc
    this.appService.showWSLayout.next(false);

    // fetch event
    this.route.params.subscribe(({eventId}) => {
      this.subscribe(
        this.eventService.get(eventId).subscribe(event => {
          this.currentEvent = event;
          this.appService.selectedEvent.next(this.currentEvent);
        })
      );
    });

    // fetch badge template
    this.fetchExternalHtml();
  }

  fetchExternalHtml(): void {
    this.subscribe(
      this.badgeTemplateService.getBadgeHTMLTemplate().subscribe(html => {
        this.badgeHTMLTemplate = html;
      })
    );
  }

  replaceBadgeContent(person: PersonAccreditationSummary, idx: number): SafeHtml {
    return this.badgeTemplateService.replaceBadgeContent(idx, this.badgeHTMLTemplate, person, this.currentEvent, false, this.people.length);
  }
}
