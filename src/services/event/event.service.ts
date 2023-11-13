import {Injectable} from '@angular/core';
import {FetchParams, WsService} from "@worldskills/worldskills-angular-lib";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable, share} from "rxjs";
import {EventContainer} from "../../types/event";

@Injectable({
  providedIn: 'root'
})
export class EventService extends WsService<any> {

  readonly url = `${environment.worldskillsApi}/accreditation/events`;

  constructor(private http: HttpClient) {
    super();
  }

  getList(params: FetchParams = {offset: 0, limit: 999}): Observable<EventContainer> {
    return this.http.get<EventContainer>(this.url, {params: params as any}).pipe(share());
  }
}
