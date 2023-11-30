import {Injectable} from '@angular/core';
import {HttpUtil, ObjectUtil, WsService} from "@worldskills/worldskills-angular-lib";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable, share} from "rxjs";
import {
  PersonAccreditationScanContainer,
  PersonAccreditationScanReqParams
} from "../../types/person-accreditation-scan";

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

  getScans(eventId: number, params: PersonAccreditationScanReqParams): Observable<PersonAccreditationScanContainer> {
    let httpParams = HttpUtil.objectToParams(ObjectUtil.stripNullOrUndefined(params || {}));

    return this.http.get<PersonAccreditationScanContainer>(this.url(eventId), {params: httpParams}).pipe(share());
  }
}
