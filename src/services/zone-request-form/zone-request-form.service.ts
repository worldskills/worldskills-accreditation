import {Injectable} from '@angular/core';
import {WsService} from "@worldskills/worldskills-angular-lib";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {ZoneRequestForm} from "../../types/zone-request/zone-request-form";
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

  getZoneReqForm(eventId: number, randomHash: string): Observable<ZoneRequestForm> {
    return this.http.get<ZoneRequestForm>(this.url(eventId) + `/${randomHash}`).pipe(share());
  }

}
