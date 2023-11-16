import {Injectable} from '@angular/core';
import {WsService} from "@worldskills/worldskills-angular-lib";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable, share} from "rxjs";
import {ZoneContainer} from "../../types/zone";

@Injectable({
  providedIn: 'root'
})
export class ZoneService extends WsService<any> {

  readonly url = (eventId: number) => {
    return `${environment.worldskillsApiAccreditation}/events/${eventId}/zones`
  };

  constructor(private http: HttpClient) {
    super();
  }

  getZones(eventId: number): Observable<ZoneContainer> {
    return this.http.get<ZoneContainer>(this.url(eventId)).pipe(share());
  }
}
