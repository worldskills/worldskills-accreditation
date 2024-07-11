import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {WsService} from "@worldskills/worldskills-angular-lib";
import {Observable, Subject} from "rxjs";
import {ZoneRequestAllocationContainer} from "../../types/zone-request/zone-request-allocation";
import {ZoneRequest} from "../../types/zone-request/zone-request";
import {PersonAccreditationSummary} from "../../types/person-accreditation-summary";

@Injectable({
  providedIn: 'root'
})
export class ZoneRequestAllocationService extends WsService<any> {

  refresh: Subject<any> = new Subject<boolean>();

  readonly url = (eventId: number) => {
    return `${environment.worldskillsApiAccreditation}/events/${eventId}/zone-request-allocation`
  };

  constructor(private http: HttpClient) {
    super();
  }

  getAllocationsForForm(eventId: number, zoneReqFormId: number): Observable<ZoneRequestAllocationContainer> {
    return this.http.get<ZoneRequestAllocationContainer>(this.url(eventId) + `/form/${zoneReqFormId}`);
  }

  getAllocationsForPersonAccreditation(eventId: number, zoneReqFormId: number, paId: number): Observable<ZoneRequestAllocationContainer> {
    return this.http.get<ZoneRequestAllocationContainer>(this.url(eventId) + `/form/${zoneReqFormId}/person-accreditation/${paId}`);
  }

  allocateRequestToZone(eventId: number, zoneReqFormId: number, zoneId: number, zoneRequest: ZoneRequest): Observable<any> {
    return this.http.post(this.url(eventId) + `/form/${zoneReqFormId}/zone/${zoneId}`, zoneRequest);
  }

  denyRequest(eventId: number, zoneRequest: ZoneRequest): Observable<any> {
    return this.http.post(this.url(eventId) + `/zone-request/${zoneRequest.id}/deny`, {});
  }

  allocatePersonACRToZone(eventId: number, zoneReqFormId: number, zoneId: number, pa: PersonAccreditationSummary): Observable<any> {
    return this.http.post(this.url(eventId) + `/form/${zoneReqFormId}/person-accreditation/${pa.id}/zone/${zoneId}`, {});
  }

  undoAllocation(eventId: number, zoneRequestAllocationId: number, notify: boolean): Observable<any> {
    return this.http.delete(this.url(eventId) + `/${zoneRequestAllocationId}/undo`, {params: {notify: notify}});
  }

  updateWristbandDistribution(eventId: number, zoneRequestAllocationId: number, isDistributed: boolean): Observable<any> {
    return this.http.put(this.url(eventId) + `/${zoneRequestAllocationId}/wristband`, isDistributed);
  }

  updateOrder(eventId: number, zoneRequestAllocationId: number, moveDirection: 'UP' | 'DOWN'): Observable<any> {
    return this.http.put(this.url(eventId) + `/${zoneRequestAllocationId}/order`, moveDirection);
  }

  sendZoneAllocatedPendingNotificationEmails(eventId: number, zoneRequestFormId: number): Observable<any> {
    return this.http.put(this.url(eventId) + `/form/${zoneRequestFormId}`, null);
  }
}
