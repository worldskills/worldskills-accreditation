import {environment} from "../../environments/environment";
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GenericUtil, HttpUtil, ObjectUtil, WsService } from '@worldskills/worldskills-angular-lib';
import { Observable, share } from 'rxjs';
import { DelegateType } from "../../types/delegate-type";
import { Image } from "../../types/image";
import { VehicleAccreditation, VehicleAccreditationFetchParams, VehicleAccreditationList, VehicleAccreditationRequest } from '../../types/vehicle-accreditation';
import { Zone } from "../../types/zone";
import { Params } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class VehicleService extends WsService<any> {

  readonly url = (eventId: number) => {
    return `${environment.worldskillsApiAccreditation}/events/${eventId}/vehicle_accreditations`
  };

  constructor(private http: HttpClient) {
    super();
  }

  createVehicleAccrediations(eventId: number, request: VehicleAccreditationRequest): Observable<VehicleAccreditationList> {
    return this.http.post<VehicleAccreditationList>(this.url(eventId), request).pipe(share());
  }

  getVehicles(eventId: number, params: VehicleAccreditationFetchParams): Observable<VehicleAccreditationList> {
    let httpParams = HttpUtil.objectToParams(ObjectUtil.stripNullOrUndefined(params || {}));

    return this.http.get<VehicleAccreditationList>(this.url(eventId), {params: httpParams}).pipe(share());
  }

  getVehicleAccreditation(eventId: number, vehicleAccreditationId: number): Observable<VehicleAccreditation> {
    return this.http.get<VehicleAccreditation>(`${this.url(eventId)}/${vehicleAccreditationId}`, {params: {l: 'en'}}).pipe(share()); // TODO dynamic locale
  }

  updateVehicleAccreditation(eventId: number, vehicleAccreditationId: number, vehicleAccreditation: VehicleAccreditation): Observable<VehicleAccreditation> {
    return this.http.put<VehicleAccreditation>(`${this.url(eventId)}/${vehicleAccreditationId}`, vehicleAccreditation).pipe(share());
  }

  batchUpdateAccreditations(eventId: number, vehicleAccreditationIds: number[], delegateType: DelegateType, zonesAdd: Zone[], zonesRemove: Zone[], distributed: boolean): Observable<any> {
    return this.http.put(`${this.url(eventId)}/batch`, {
      ids: vehicleAccreditationIds,
      delegate_type: delegateType,
      zones_add: zonesAdd,
      zones_remove: zonesRemove,
      distributed,
    }).pipe(share());
  }

  invalidateBadge(eventId: number, vehicleAccreditationId: number): Observable<any> {
    return this.http.delete(`${this.url(eventId)}/${vehicleAccreditationId}/randomHash`).pipe(share());
  }

  markAsDistributed(eventId: number, vehicleAccreditationId: number): Observable<any> {
    return this.http.put(`${this.url(eventId)}/${vehicleAccreditationId}/distributed`, null).pipe(share());
  }

  markAsPrinted(eventId: number, vehicleAccreditationId: number): Observable<any> {
    return this.http.put(`${this.url(eventId)}/${vehicleAccreditationId}/printed`, null).pipe(share());
  }

  uploadAccreditationPhoto(eventId: number, vehicleAccreditationId: number, image: Image): Observable<VehicleAccreditation> {
    return this.http.post<VehicleAccreditation>(`${this.url(eventId)}/${vehicleAccreditationId}/photo`, image).pipe(share());
  }

  initialiseFetchParams(): VehicleAccreditationFetchParams {
    return {
      l: 'en',
      query: null,
      zone: [],
      printed: null,
      distributed: null,
      del_types: [],
      offset: 0,
      limit: 10
    }
  }

  loadFilterFromQueryParams(params: Params, fetchParams: VehicleAccreditationFetchParams): void {

    if ('zone' in params && !GenericUtil.isNullOrUndefined(params['zone'])) {
      const zone = params['zone'];
      if (typeof zone === 'string') {
        fetchParams.zone = [+zone];
      } else {
        fetchParams.zone = (zone as []).map(z => +z);
      }
    }

    if ('printed' in params && !GenericUtil.isNullOrUndefined(params['printed'])) {
      fetchParams.printed = params['printed'] === 'true';
    }

    if ('distributed' in params && !GenericUtil.isNullOrUndefined(params['distributed'])) {
      fetchParams.distributed = params['distributed'] === 'true';
    }

    if ('del_types' in params && !GenericUtil.isNullOrUndefined(params['del_types'])) {
      const delTypes = params['del_types'];
      if (typeof delTypes === 'string') {
        fetchParams.del_types = [+delTypes];
      } else {
        fetchParams.del_types = (delTypes as []).map(dt => +dt);
      }
    }

    if ('offset' in params && !GenericUtil.isNullOrUndefined(params['offset'])) {
      fetchParams.offset = +params['offset'];
    }

    if ('limit' in params && !GenericUtil.isNullOrUndefined(params['limit'])) {
      fetchParams.limit = +params['limit'];
    }
  }

}
