import {Injectable} from '@angular/core';
import {WsService} from "@worldskills/worldskills-angular-lib";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable, of, share} from "rxjs";
import {PackageOptionContainer} from "../../types/package-option";
import {ZoneContainer} from "../../types/zone";

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

  getPackageOptionZones(packageOptionId: number): Observable<ZoneContainer> {
    return this.http.get<ZoneContainer>(this.url + `/${packageOptionId}/zones`).pipe(share());
  }

  updatePackageOptionZones(packageOptionId: number, zones: ZoneContainer): Observable<ZoneContainer> {
    return this.http.put<ZoneContainer>(this.url + `/${packageOptionId}/zones`, zones).pipe(share());
  }
}
