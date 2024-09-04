import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {WsService} from "@worldskills/worldskills-angular-lib";
import {Observable, share, Subject} from "rxjs";
import {
  ZoneRequestAllocationContainer,
  ZoneRequestAllocationDirectEditOrderView
} from "../../types/zone-request/zone-request-allocation";
import {ZoneRequest} from "../../types/zone-request/zone-request";
import {PersonAccreditationSummary} from "../../types/person-accreditation-summary";
import {Person} from "../../types/person";

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

  allocateNewPersonToZone(eventId: number, zoneReqFormId: number, zoneId: number, person: Person): Observable<any> {
    return this.http.post(this.url(eventId) + `/form/${zoneReqFormId}/new-person/zone/${zoneId}`, person);
  }

  undoAllocation(eventId: number, zoneRequestAllocationId: number, notify: boolean): Observable<any> {
    return this.http.delete(this.url(eventId) + `/${zoneRequestAllocationId}/undo`, {params: {notify: notify}});
  }

  updateWristbandDistribution(eventId: number, zoneRequestAllocationId: number, isDistributed: boolean): Observable<any> {
    return this.http.put(this.url(eventId) + `/${zoneRequestAllocationId}/wristband`, isDistributed);
  }

  updateOrder(eventId: number, zoneRequestAllocationId: number, zoneReqAllocVersion: number, moveDirection: 'UP' | 'DOWN'): Observable<any> {
    return this.http.put(this.url(eventId) + `/${zoneRequestAllocationId}/order?zone_req_alloc_version=${zoneReqAllocVersion}`, {'move_direction' : moveDirection});
  }

  directEditOrder(eventId: number, zoneRequestAllocationId: number, zoneReqAllocVersion: number, view: ZoneRequestAllocationDirectEditOrderView): Observable<any> {
    return this.http.put(this.url(eventId) + `/${zoneRequestAllocationId}/direct_edit_order?zone_req_alloc_version=${zoneReqAllocVersion}`, view);
  }

  sendZoneAllocatedPendingNotificationEmails(eventId: number, zoneRequestFormId: number): Observable<any> {
    return this.http.put(this.url(eventId) + `/form/${zoneRequestFormId}`, null);
  }

  exportZoneAllocations(eventId: number, zoneReqFormId: number): Observable<any> {
    let httpParams = new HttpParams();
    httpParams = httpParams.set('export', 'true');

    return this.http.get(this.url(eventId) + "/form/" + zoneReqFormId, {
      responseType: 'arraybuffer',
      params: httpParams
    }).pipe(share());
  }
}
