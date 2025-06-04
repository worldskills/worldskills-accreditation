import {Injectable} from '@angular/core';
import {HttpUtil, ObjectUtil, WsService} from "@worldskills/worldskills-angular-lib";
import {environment} from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import {Observable, share} from "rxjs";
import {
  PersonAccreditationScanContainer,
  PersonAccreditationScanReqParams
} from "../../types/person-accreditation-scan";
import {Event} from "../../types/event";

@Injectable({
  providedIn: 'root'
})
export class ScanService extends WsService<any> {

  readonly url = (eventId: number) => {
    return `${environment.worldskillsApiAccreditation}/events/${eventId}/scans`
  };

  constructor(private http: HttpClient) {
    super();
  }

  initialiseFetchParams(selectedEvent: Event): PersonAccreditationScanReqParams {
    return {
      from: null,
      to: null,
      eventId: selectedEvent.id,
      zone: null,
      position: null,
      member: null,
      accreditation: null,
      offset: 0,
      limit: 10
    }
  }

  getScans(eventId: number, params: PersonAccreditationScanReqParams): Observable<PersonAccreditationScanContainer> {
    let httpParams = HttpUtil.objectToParams(ObjectUtil.stripNullOrUndefined(params || {}));

    return this.http.get<PersonAccreditationScanContainer>(this.url(eventId), {params: httpParams}).pipe(share());
  }

  exportScans(eventId: number, params: PersonAccreditationScanReqParams): Observable<any> {
    let httpParams = HttpUtil.objectToParams(ObjectUtil.stripNullOrUndefined(params || {}));

    return this.http.get(this.url(eventId) + "/export", {
      responseType: 'arraybuffer',
      params: httpParams
    }).pipe(share());
  }
}
