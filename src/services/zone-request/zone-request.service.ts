import {Injectable} from '@angular/core';
import {HttpUtil, ObjectUtil, WsService} from "@worldskills/worldskills-angular-lib";
import {ZoneRequest, ZoneRequestContainer, ZoneRequestReqParams} from "../../types/zone-request/zone-request";
import {environment} from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import {Observable, share, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ZoneRequestService extends WsService<any> {

  refresh: Subject<any> = new Subject<boolean>();

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

  exportZoneRequests(eventId: number, zoneReqFormId: number, params?: ZoneRequestReqParams): Observable<any> {
    let httpParams = HttpUtil.objectToParams(ObjectUtil.stripNullOrUndefined(params || {}));

    httpParams = httpParams.set('export', 'true');

    return this.http.get(this.url(eventId) + "/form/" + zoneReqFormId, {
      responseType: 'arraybuffer',
      params: httpParams
    }).pipe(share());
  }
}
