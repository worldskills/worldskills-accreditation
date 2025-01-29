import {Injectable} from '@angular/core';
import {WsService} from "@worldskills/worldskills-angular-lib";
import {environment} from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import {Observable, share} from "rxjs";
import {DelegateType, DelegateTypeContainer} from "../../types/delegate-type";

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

  getList(eventId: number, params?: {}): Observable<DelegateTypeContainer> {
    return this.http.get<DelegateTypeContainer>(this.url(eventId), {params}).pipe(share());
  }

  get(delTypeId: number, eventId: number): Observable<DelegateType> {
    return this.http.get<DelegateType>(this.url(eventId) + `/${delTypeId}`).pipe(share());
  }

  create(eventId: number, delegateType: DelegateType): Observable<DelegateType> {
    return this.http.post<DelegateType>(this.url(eventId), delegateType).pipe(share());
  }

  update(eventId: number, delegateType: DelegateType): Observable<DelegateType> {
    return this.http.put<DelegateType>(this.url(eventId) + `/${delegateType.id}`, delegateType).pipe(share());
  }

  delete(eventId: number, delegateTypeId: number): Observable<any> {
    return this.http.delete<any>(this.url(eventId) + `/${delegateTypeId}`).pipe(share());
  }
}
