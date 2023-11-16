import {Injectable} from '@angular/core';
import {HttpUtil, ObjectUtil, WsService} from "@worldskills/worldskills-angular-lib";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable, share} from "rxjs";
import {
  PersonAccreditationSummaryContainer,
  PersonAccreditationSummaryReqParams
} from "../../types/person-accreditation-summary";

@Injectable({
  providedIn: 'root'
})
export class PersonAccreditationService extends WsService<any> {

  readonly url = (eventId: number) => {
    return `${environment.worldskillsApiAccreditation}/events/${eventId}/accreditations`
  };

  constructor(private http: HttpClient) {
    super();
  }

  getAccreditations(eventId: number, params: PersonAccreditationSummaryReqParams): Observable<PersonAccreditationSummaryContainer> {
    let httpParams = HttpUtil.objectToParams(ObjectUtil.stripNullOrUndefined(params || {}));

    return this.http.get<PersonAccreditationSummaryContainer>(this.url(eventId), {params: httpParams}).pipe(share());
  }
}
