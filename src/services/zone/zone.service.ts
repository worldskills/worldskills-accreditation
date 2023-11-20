import {Injectable} from '@angular/core';
import {WsService} from "@worldskills/worldskills-angular-lib";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable, share} from "rxjs";
import {Zone, ZoneContainer} from "../../types/zone";

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

  getList(eventId: number): Observable<ZoneContainer> {
    return this.http.get<ZoneContainer>(this.url(eventId)).pipe(share());
  }

  create(eventId: number, zone: Zone): Observable<Zone> {
    return this.http.post<Zone>(this.url(eventId), zone).pipe(share());
  }

  update(eventId: number, zone: Zone): Observable<Zone> {
    return this.http.put<Zone>(this.url(eventId) + `/${zone.id}`, zone).pipe(share());
  }
}
