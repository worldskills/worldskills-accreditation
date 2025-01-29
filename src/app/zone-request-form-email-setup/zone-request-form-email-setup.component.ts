import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {WsComponent} from "@worldskills/worldskills-angular-lib";
import {ToastService} from "angular-toastify";
import {ZoneRequestForm} from "../../types/zone-request/zone-request-form";
import {Event} from "../../types/event";
import {NgForm} from "@angular/forms";
import {ZoneRequestFormEmail, ZoneRequestFormEmailType} from "../../types/zone-request/zone-request-form-email";
import {ZoneRequestFormEmailService} from "../../services/zone-request-form-email/zone-request-form-email.service";

@Component({
  selector: 'app-zone-request-form-email-setup',
  templateUrl: './zone-request-form-email-setup.component.html',
  styleUrls: ['./zone-request-form-email-setup.component.css'],
  standalone: false
})
export class ZoneRequestFormEmailSetupComponent extends WsComponent implements OnInit {

  @Output() cancelForm: EventEmitter<void> = new EventEmitter<void>();
  @Input() zoneReqForm: ZoneRequestForm;
  @Input() selectedEvent: Event;
  @ViewChild('form') form: NgForm;

  emails: ZoneRequestFormEmail[] = [];
  emailFrom: string;
  emailManager: string[];

  constructor(private toastService: ToastService,
              private zoneReqFormEmailService: ZoneRequestFormEmailService) {
    super();
  }

  ngOnInit(): void {
    this.subscribe(
      this.zoneReqFormEmailService.getEmails(this.selectedEvent?.id, this.zoneReqForm?.id).subscribe(res => {
        this.emails = res.emails;
        this.emailFrom = this.emails?.find(e => e.type === ZoneRequestFormEmailType.FROM)?.email_address ?? null;
        this.emailManager = this.emails?.filter(e => e.type === ZoneRequestFormEmailType.MANAGER).map(e => e.email_address) ?? null;
      })
    )
  }

  cancel() {
    this.cancelForm.emit();
  }

  save(): void {
    if (this.form.valid) {
      const emails: ZoneRequestFormEmail[] =
        [
          {email_address: this.form.value.from, type: ZoneRequestFormEmailType.FROM},
          ...this.form.value.manager.map((e: string) => ({email_address: e, type: ZoneRequestFormEmailType.MANAGER}))
        ];
      this.zoneReqFormEmailService.updateEmails(this.selectedEvent.id, this.zoneReqForm.id, {emails}).subscribe(res => {
        this.toastService.success('Emails updated successfully');
        this.cancel();
      });
    } else {
      this.toastService.error('Please fill all required fields');
    }
  }
}
