import {Component, OnInit} from '@angular/core';
import {WsComponent} from "@worldskills/worldskills-angular-lib";
import {Event} from "../../types/event";
import {AppService} from "../../services/app/app.service";
import {ZoneRequestFormService} from "../../services/zone-request-form/zone-request-form.service";
import {ZoneRequestForm} from "../../types/zone-request/zone-request-form";
import {Clipboard} from '@angular/cdk/clipboard';
import {environment} from "../../environments/environment";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastService} from "angular-toastify";

@Component({
  selector: 'app-zone-request-form',
  templateUrl: './zone-request-form.component.html',
  styleUrls: ['./zone-request-form.component.css']
})
export class ZoneRequestFormComponent extends WsComponent implements OnInit {

  selectedEvent: Event;
  loading = false;
  forms: ZoneRequestForm[];

  manageForm: ZoneRequestForm = null;
  setupEmailForm: ZoneRequestForm = null;

  constructor(private appService: AppService,
              private zoneReqFormService: ZoneRequestFormService,
              private clipboard: Clipboard,
              private route: ActivatedRoute,
              private toastService: ToastService,
              private router: Router) {
    super();
  }

  ngOnInit(): void {
    this.appService.showMenuTabs.next(true);

    this.subscribe(
      this.appService.selectedEvent.subscribe(event => {
        this.selectedEvent = event;

        this.subscribe(
          // load forms by event
          this.loadForms()
        )
      })
    )
  }

  private loadForms() {
    return this.zoneReqFormService.getForms(this.selectedEvent.id).subscribe(res => {
      this.forms = res.zone_request_forms;
    });
  }

  addNew() {
    this.manageForm = {
      id: 0,
      random_hash: '',
      event_id: this.selectedEvent.id,
      name: {
        lang_code: 'en',
        text: ''
      },
      header_text: {
        lang_code: 'en',
        text: ''
      },
      open_for_request: false,
      zones: []
    }
  }

  copyURLToClipboard(form: ZoneRequestForm, copyFormBtn: HTMLButtonElement): void {
    this.clipboard.copy(`${environment.worldskillsAccreditation}/events/${this.selectedEvent.id}/zone-request-form/${form.random_hash}`);

    // change button content to 'Copied!' for a short time
    const prevBtnContent = copyFormBtn.innerHTML;
    copyFormBtn.innerHTML = 'Copied!';
    setTimeout(() => {
      copyFormBtn.innerHTML = prevBtnContent;
    }, 800);
  }

  allocate(form: ZoneRequestForm): void {
    const url = this.router.serializeUrl(this.router.createUrlTree([`${form.random_hash}/allocate`], {relativeTo: this.route}));
    window.open(url, '_blank');
  }

  scanFinderVerify(form: ZoneRequestForm): void {
    const url = this.router.serializeUrl(this.router.createUrlTree([`${form.random_hash}/finder-verify`], {relativeTo: this.route}));
    window.open(url, '_blank');
  }

  save(form: ZoneRequestForm): void {
    (form.id > 0 ? this.zoneReqFormService.updateZoneReqForm(this.selectedEvent.id, form.id, form) : this.zoneReqFormService.createZoneReqForm(this.selectedEvent.id, form))
      .subscribe(res => {
        this.loadForms();
        this.manageForm = null;
        this.toastService.success('Form is saved!');
      });
  }

  updateForm(form: ZoneRequestForm): void {
    this.manageForm = form;
  }

  setupEmail(form: ZoneRequestForm): void {
    this.setupEmailForm = form;
  }
}
