import {Injectable} from '@angular/core';
import {WsService} from "@worldskills/worldskills-angular-lib";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable, share} from "rxjs";
import {DelegateTypeContainer} from "../../types/delegate-type";

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

  getDelegateTypes(eventId: number): Observable<DelegateTypeContainer> {
    return this.http.get<DelegateTypeContainer>(this.url(eventId)).pipe(share());
  }
}