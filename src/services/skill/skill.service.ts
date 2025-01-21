import {Injectable} from '@angular/core';
import {WsService} from "@worldskills/worldskills-angular-lib";
import {environment} from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import {Observable, share} from "rxjs";
import {SkillContainer} from "../../types/skill";

@Injectable({
  providedIn: 'root'
})
export class SkillService extends WsService<any> {

  readonly url = (eventId: number) => {
    return `${environment.worldskillsApiAccreditation}/events/${eventId}/skills`
  };

  constructor(private http: HttpClient) {
    super();
  }

  getSkills(eventId: number): Observable<SkillContainer> {
    return this.http.get<SkillContainer>(this.url(eventId)).pipe(share());
  }
}
