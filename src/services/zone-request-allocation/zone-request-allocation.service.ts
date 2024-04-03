import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {WsService} from "@worldskills/worldskills-angular-lib";
import {Observable, Subject} from "rxjs";
import {ZoneRequestAllocationContainer} from "../../types/zone-request/zone-request-allocation";
import {ZoneRequest} from "../../types/zone-request/zone-request";

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

  allocateRequestToZone(eventId: number, zoneRequest: ZoneRequest, zoneId: number): Observable<any> {
    return this.http.post(this.url(eventId) + `/zone/${zoneId}`, zoneRequest);
  }
}
