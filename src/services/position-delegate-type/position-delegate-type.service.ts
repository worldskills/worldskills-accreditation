import {Injectable} from '@angular/core';
import {WsService} from "@worldskills/worldskills-angular-lib";
import {environment} from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import {Observable, share} from "rxjs";
import {PositionDelegateTypeContainer} from "../../types/position-delegate-type";

@Injectable({
  providedIn: 'root'
})
export class PositionDelegateTypeService extends WsService<any> {

  readonly url = (eventId: number) => {
    return `${environment.worldskillsApiAccreditation}/events/${eventId}/positions`
  };

  constructor(private http: HttpClient) {
    super();
  }

  getPositions(eventId: number): Observable<PositionDelegateTypeContainer> {
    return this.http.get<PositionDelegateTypeContainer>(this.url(eventId)).pipe(share());
  }

  update(eventId: number, positions: PositionDelegateTypeContainer): Observable<PositionDelegateTypeContainer> {
    return this.http.put<PositionDelegateTypeContainer>(this.url(eventId), positions).pipe(share());
  }
}
