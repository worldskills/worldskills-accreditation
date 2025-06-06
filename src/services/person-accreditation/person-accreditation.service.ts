import {Injectable} from '@angular/core';
import {GenericUtil, HttpUtil, ObjectUtil, WsService} from "@worldskills/worldskills-angular-lib";
import {environment} from "../../environments/environment";
import { HttpClient } from "@angular/common/http";
import {Observable, share} from "rxjs";
import {
  PersonAccreditationSummary,
  PersonAccreditationSummaryContainer,
  PersonAccreditationSummaryReqParams
} from "../../types/person-accreditation-summary";
import {PersonAccreditation} from "../../types/person-accreditation";
import {Params} from "@angular/router";
import {isEmpty} from "../../utils/StringUtil";
import {Image} from "../../types/image";
import { Event } from '../../types/event';
import { Position } from '../../types/position';
import { Zone } from 'src/types/zone';

@Injectable({
  providedIn: 'root'
})
export class PersonAccreditationService extends WsService<any> {

  readonly url = (eventId: number) => {
    return `${environment.worldskillsApiAccreditation}/events/${eventId}/accreditations`
  };

  constructor(private http: HttpClient) {
    super();
  }

  getAccreditations(eventId: number, params: PersonAccreditationSummaryReqParams): Observable<PersonAccreditationSummaryContainer> {
    let httpParams = HttpUtil.objectToParams(ObjectUtil.stripNullOrUndefined(params || {}));

    return this.http.get<PersonAccreditationSummaryContainer>(this.url(eventId), {params: httpParams}).pipe(share());
  }

  getPersonAccreditation(eventId: number, personAccreditationId: number): Observable<PersonAccreditation> {
    return this.http.get<PersonAccreditation>(`${this.url(eventId)}/${personAccreditationId}`, {params: {l: 'en'}}).pipe(share()); // TODO dynamic locale
  }

  updatePersonAccreditation(eventId: number, personAccreditationId: number, personAccreditation: PersonAccreditation): Observable<PersonAccreditation> {
    return this.http.put<PersonAccreditation>(`${this.url(eventId)}/${personAccreditationId}`, personAccreditation).pipe(share());
  }

  batchUpdateAccreditations(eventId: number, personAccreditationIds: number[], position: Position, zonesAdd: Zone[], zonesRemove: Zone[], distributed: boolean): Observable<any> {
    return this.http.put(`${this.url(eventId)}/batch`, {
      ids: personAccreditationIds,
      position: position,
      zones_add: zonesAdd,
      zones_remove: zonesRemove,
      distributed,
    }).pipe(share());
  }

  invalidateBadge(eventId: number, personAccreditationId: number): Observable<any> {
    return this.http.delete(`${this.url(eventId)}/${personAccreditationId}/randomHash`).pipe(share());
  }

  markAsDistributed(eventId: number, personAccreditationId: number): Observable<any> {
    return this.http.put(`${this.url(eventId)}/${personAccreditationId}/distributed`, null).pipe(share());
  }

  markAsPrinted(eventId: number, personAccreditationId: number): Observable<any> {
    return this.http.put(`${this.url(eventId)}/${personAccreditationId}/printed`, null).pipe(share());
  }

  uploadAccreditationPhoto(eventId: number, personAccreditationId: number, image: Image): Observable<PersonAccreditation> {
    return this.http.post<PersonAccreditation>(`${this.url(eventId)}/${personAccreditationId}/photo`, image).pipe(share());
  }

  canBePrinted(event: Event, personAccreditation: PersonAccreditationSummary): boolean {
    return !event.require_host_approval || this.hasBeenApproved(personAccreditation);
  }

  hasBeenApproved(personAccreditation: PersonAccreditationSummary): boolean {
    return personAccreditation?.host_info_status === 'APPROVED';
  }

  initialiseFetchParams(): PersonAccreditationSummaryReqParams {
    return {
      l: 'en', // TODO dynamic locale
      name: null,
      country: null,
      member: null,
      pos_id: null,
      pos_name: null,
      skill: null,
      group: null,
      zone: [],
      printed: null,
      distributed: null,
      overridden: null,
      photo: null,
      positions: [],
      offset: 0,
      limit: 10
    }
  }

  buildQueryParams(fetchParams: PersonAccreditationSummaryReqParams): Params {
    const queryParams: Params = {};

    if (!isEmpty(fetchParams.name)) {
      queryParams['name'] = fetchParams.name;
    } else {
      queryParams['name'] = null;
    }

    if (!isEmpty(fetchParams.country)) {
      queryParams['country'] = fetchParams.country;
    } else {
      queryParams['country'] = null;
    }

    if (!GenericUtil.isNullOrUndefined(fetchParams.member)) {
      queryParams['member'] = fetchParams.member;
    } else {
      queryParams['member'] = null;
    }

    if (!GenericUtil.isNullOrUndefined(fetchParams.pos_id)) {
      queryParams['pos_id'] = fetchParams.pos_id;
    } else {
      queryParams['pos_id'] = null;
    }

    if (!isEmpty(fetchParams.pos_name)) {
      queryParams['pos_name'] = fetchParams.pos_name;
    } else {
      queryParams['pos_name'] = null;
    }

    if (!GenericUtil.isNullOrUndefined(fetchParams.skill)) {
      queryParams['skill'] = fetchParams.skill;
    } else {
      queryParams['skill'] = null;
    }

    if (!isEmpty(fetchParams.group)) {
      queryParams['group'] = fetchParams.group;
    } else {
      queryParams['group'] = null;
    }

    if (!GenericUtil.isNullOrUndefined(fetchParams.zone)) {
      queryParams['zone'] = fetchParams.zone;
    } else {
      queryParams['zone'] = null;
    }

    if (!GenericUtil.isNullOrUndefined(fetchParams.printed)) {
      queryParams['printed'] = fetchParams.printed;
    } else {
      queryParams['printed'] = null;
    }

    if (!GenericUtil.isNullOrUndefined(fetchParams.distributed)) {
      queryParams['distributed'] = fetchParams.distributed;
    } else {
      queryParams['distributed'] = null;
    }

    if (!GenericUtil.isNullOrUndefined(fetchParams.overridden)) {
      queryParams['overridden'] = fetchParams.overridden;
    } else {
      queryParams['overridden'] = null;
    }

    if (!GenericUtil.isNullOrUndefined(fetchParams.photo)) {
      queryParams['photo'] = fetchParams.photo;
    } else {
      queryParams['photo'] = null;
    }

    if (!GenericUtil.isNullOrUndefined(fetchParams.positions)) {
      queryParams['positions'] = fetchParams.positions;
    } else {
      queryParams['positions'] = null;
    }

    if (!GenericUtil.isNullOrUndefined(fetchParams.offset)) {
      queryParams['offset'] = fetchParams.offset;
    } else {
      queryParams['offset'] = null;
    }

    if (!GenericUtil.isNullOrUndefined(fetchParams.limit)) {
      queryParams['limit'] = fetchParams.limit;
    } else {
      queryParams['limit'] = null;
    }

    return queryParams;
  }

  loadFilterFromQueryParams(params: Params, fetchParams: PersonAccreditationSummaryReqParams): void {
    if ('name' in params && !GenericUtil.isNullOrUndefined(params['name'])) {
      fetchParams.name = params['name'];
    }

    if ('country' in params && !GenericUtil.isNullOrUndefined(params['country'])) {
      fetchParams.country = params['country'];
    }

    if ('member' in params && !GenericUtil.isNullOrUndefined(params['member'])) {
      fetchParams.member = +params['member'];
    }

    if ('pos_id' in params && !GenericUtil.isNullOrUndefined(params['pos_id'])) {
      fetchParams.pos_id = +params['pos_id'];
    }

    if ('pos_name' in params && !GenericUtil.isNullOrUndefined(params['pos_name'])) {
      fetchParams.pos_name = params['pos_name'];
    }

    if ('skill' in params && !GenericUtil.isNullOrUndefined(params['skill'])) {
      fetchParams.skill = +params['skill'];
    }

    if ('group' in params && !GenericUtil.isNullOrUndefined(params['group'])) {
      fetchParams.group = params['group'];
    }

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

    if ('overridden' in params && !GenericUtil.isNullOrUndefined(params['overridden'])) {
      fetchParams.overridden = params['overridden'] === 'true';
    }

    if ('photo' in params && !GenericUtil.isNullOrUndefined(params['photo'])) {
      fetchParams.photo = params['photo'] === 'true';
    }

    if ('positions' in params && !GenericUtil.isNullOrUndefined(params['positions'])) {
      const positions = params['positions'];
      if (typeof positions === 'string') {
        fetchParams.positions = [+positions];
      } else {
        fetchParams.positions = (positions as []).map(p => +p);
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
