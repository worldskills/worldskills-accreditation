import {Injectable} from '@angular/core';
import {WsService} from "@worldskills/worldskills-angular-lib";
import {environment} from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import {Observable, share} from "rxjs";
import {ZoneRequestFormEmailContainer} from "../../types/zone-request/zone-request-form-email";

@Injectable({
  providedIn: 'root'
})
export class ZoneRequestFormEmailService extends WsService<any> {
  readonly url = (eventId: number) => {
    return `${environment.worldskillsApiAccreditation}/events/${eventId}/zone-request-form-email`
  };

  constructor(private http: HttpClient) {
    super();
  }

  getEmails(eventId: number, formId: number): Observable<ZoneRequestFormEmailContainer> {
    return this.http.get<ZoneRequestFormEmailContainer>(this.url(eventId) + `/form/${formId}`).pipe(share());
  }

  updateEmails(eventId: number, formId: number, emails: ZoneRequestFormEmailContainer): Observable<ZoneRequestFormEmailContainer> {
    return this.http.put<ZoneRequestFormEmailContainer>(this.url(eventId) + `/form/${formId}`, emails).pipe(share());
  }
}
