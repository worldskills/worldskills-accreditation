import {Injectable} from '@angular/core';
import {WsService} from "@worldskills/worldskills-angular-lib";
import {environment} from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import {Observable, share} from "rxjs";
import {Position, PositionList} from '../../types/position';

@Injectable({
  providedIn: 'root'
})
export class DelegateTypeService extends WsService<any> {

  readonly url = (eventId: number) => {
    return `${environment.worldskillsApiAccreditation}/events/${eventId}/delegate_types`
  };

  constructor(private http: HttpClient) {
    super();
  }

  getList(eventId: number, params?: {}): Observable<PositionList> {
    return this.http.get<PositionList>(this.url(eventId), {params}).pipe(share());
  }

  get(delTypeId: number, eventId: number): Observable<Position> {
    return this.http.get<Position>(this.url(eventId) + `/${delTypeId}`).pipe(share());
  }

  update(eventId: number, delegateType: Position): Observable<Position> {
    return this.http.put<Position>(this.url(eventId) + `/${delegateType.id}`, delegateType).pipe(share());
  }

  delete(eventId: number, delegateTypeId: number): Observable<any> {
    return this.http.delete<any>(this.url(eventId) + `/${delegateTypeId}`).pipe(share());
  }
}
