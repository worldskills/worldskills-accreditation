import {Injectable} from '@angular/core';
import {WsService} from "@worldskills/worldskills-angular-lib";
import {environment} from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import {ZoneRequestForm, ZoneRequestFormContainer} from "../../types/zone-request/zone-request-form";
import {Observable, share} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ZoneRequestFormService extends WsService<any> {

  readonly url = (eventId: number) => {
    return `${environment.worldskillsApiAccreditation}/events/${eventId}/zone-request-forms`
  };

  constructor(private http: HttpClient) {
    super();
  }

  getForms(eventId: number): Observable<ZoneRequestFormContainer> {
    return this.http.get<ZoneRequestFormContainer>(this.url(eventId)).pipe(share());
  }

  getZoneReqForm(eventId: number, randomHash: string): Observable<ZoneRequestForm> {
    return this.http.get<ZoneRequestForm>(this.url(eventId) + `/${randomHash}`).pipe(share());
  }

  createZoneReqForm(eventId: number, zoneReqForm: ZoneRequestForm): Observable<ZoneRequestForm> {
    return this.http.post<ZoneRequestForm>(this.url(eventId), zoneReqForm).pipe(share());
  }

  updateZoneReqForm(eventId: number, formId: number, zoneReqForm: ZoneRequestForm): Observable<ZoneRequestForm> {
    return this.http.put<ZoneRequestForm>(this.url(eventId) + `/${formId}`, zoneReqForm).pipe(share());
  }
}
