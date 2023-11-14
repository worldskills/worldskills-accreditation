import {Injectable} from '@angular/core';
import {FetchParams, WsService} from "@worldskills/worldskills-angular-lib";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable, share} from "rxjs";
import {Event, EventContainer} from "../../types/event";

@Injectable({
  providedIn: 'root'
})
export class EventService extends WsService<any> {

  readonly url = `${environment.worldskillsApiAccreditation}/events`;

  constructor(private http: HttpClient) {
    super();
  }

  get(eventId: number): Observable<Event> {
    return this.http.get<Event>(`${this.url}/${eventId}`).pipe(share());
  }

  getList(params: FetchParams = {offset: 0, limit: 999}): Observable<EventContainer> {
    return this.http.get<EventContainer>(this.url, {params: params as any}).pipe(share());
  }
}
