import {Injectable} from '@angular/core';
import {WsService} from "@worldskills/worldskills-angular-lib";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable, share} from "rxjs";
import {PackageOptionContainer} from "../../types/package-option";

@Injectable({
  providedIn: 'root'
})
export class PackageOptionService extends WsService<any> {

  readonly url = `${environment.worldskillsApiAccreditation}/package_options`;

  constructor(private http: HttpClient) {
    super();
  }

  getOptions(eventId: number): Observable<PackageOptionContainer> {
    return this.http.get<PackageOptionContainer>(this.url + `?event=${eventId}`).pipe(share());
  }
}
