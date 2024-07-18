import {Injectable} from '@angular/core';
import {WsService} from "@worldskills/worldskills-angular-lib";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable, share} from "rxjs";
import {
  ZoneRequestFormPositionContainer,
  ZoneRequestFormPositionType
} from "../../types/zone-request/zone-request-form-position";

@Injectable({
  providedIn: 'root'
})
export class ZoneRequestFormPositionService extends WsService<any> {

  readonly url = (eventId: number) => {
    return `${environment.worldskillsApiAccreditation}/events/${eventId}/zone-request-form-position`
  };

  constructor(private http: HttpClient) {
    super();
  }

  getPositions(eventId: number, formId: number, type: ZoneRequestFormPositionType): Observable<ZoneRequestFormPositionContainer> {
    return this.http.get<ZoneRequestFormPositionContainer>(this.url(eventId) + `/form/${formId}`, {params: {type: type}}).pipe(share());
  }

}
