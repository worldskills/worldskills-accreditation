import {environment} from "../../environments/environment";
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpUtil, ObjectUtil, WsService } from '@worldskills/worldskills-angular-lib';
import { Observable, share } from 'rxjs';
import { VehicleGroup, VehicleGroupList } from "../../types/vehicle-group";

@Injectable({
  providedIn: 'root'
})
export class VehicleGroupService extends WsService<any> {

  readonly url = (eventId: number) => {
    return `${environment.worldskillsApiAccreditation}/events/${eventId}/vehicle_groups`
  };

  constructor(private http: HttpClient) {
    super();
  }

  createVehicleGroup(eventId: number, group: VehicleGroup): Observable<VehicleGroup> {
    return this.http.post<VehicleGroup>(this.url(eventId), group).pipe(share());
  }

  getVehicleGroups(eventId: number): Observable<VehicleGroupList> {
    return this.http.get<VehicleGroupList>(this.url(eventId)).pipe(share());
  }

}
