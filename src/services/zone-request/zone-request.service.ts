import {Injectable} from '@angular/core';
import {WsService} from "@worldskills/worldskills-angular-lib";
import {ZoneRequest, ZoneRequestContainer} from "../../types/zone-request/zone-request";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ZoneRequestService extends WsService<any> {

  readonly url = (eventId: number) => {
    return `${environment.worldskillsApiAccreditation}/events/${eventId}/zone-requests`
  };

  constructor(private http: HttpClient) {
    super();
  }

  requestZone(eventId: number, zoneReqFormId: number, request: ZoneRequest): Observable<ZoneRequest> {
    return this.http.post<ZoneRequest>(this.url(eventId) + `/form/${zoneReqFormId}`, request);
  }

  getRequest(eventId: number, zoneReqId: number): Observable<ZoneRequest> {
    return this.http.get<ZoneRequest>(this.url(eventId) + `/${zoneReqId}`);
  }

  getRequests(eventId: number, zoneReqFormId: number): Observable<ZoneRequestContainer> {
    return this.http.get<ZoneRequestContainer>(this.url(eventId) + `/form/${zoneReqFormId}`);
  }
}
