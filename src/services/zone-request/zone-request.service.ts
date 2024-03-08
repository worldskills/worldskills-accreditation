import {Injectable} from '@angular/core';
import {WsService} from "@worldskills/worldskills-angular-lib";
import {ZoneRequestForm} from "../../types/zone-request/zone-request-form";
import {ZoneRequestFormZone} from "../../types/zone-request/zone-request-form-zone";
import {Zone} from "../../types/zone";
import {ZoneRequest, ZoneRequestContainer} from "../../types/zone-request/zone-request";
import {PersonAccreditation} from "../../types/person-accreditation";
import {Person} from "../../types/person";
import {ZoneRequestAllocation} from "../../types/zone-request/ZoneRequestAllocation";
import {environment} from "../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ZoneRequestService extends WsService<any> {

  zoneReqForm: ZoneRequestForm = {
    id: 1,
    random_hash: '9188d942-66bb-4c23-af98-58c76aeb24cb',
    event_id: 1,
    name: {
      text: 'Media Zone Request for Opening Ceremony',
      lang_code: 'en'
    },
    header_text: {
      text: 'Please choose your preferred zone for the opening ceremony. Submit your request by 22 August 2024.',
      lang_code: 'en'
    },
    open_for_request: true,
    zones: []
  }
  zones: Zone[] = [
    {
      id: 1,
      name: 'Winners Circle',
      code: 'Z001',
      color: '#ffaeae',
      sort: 1,
      text_color: '#FFFFFF'
    },
    {
      id: 2,
      name: 'Media Platform',
      code: 'Z002',
      color: '#fff4ae',
      sort: 2,
      text_color: '#FFFFFF'
    }, {
      id: 3,
      name: 'Video position',
      code: 'Z003',
      color: '#b1aeff',
      sort: 1,
      text_color: '#FFFFFF'
    }
  ]
  zoneReqFormZone: ZoneRequestFormZone[] = [
    {
      id: 1,
      zone_request_form_id: this.zoneReqForm.id,
      zone: this.zones[0],
      quota: 10,
      available_for_allocation: true,
      available_for_request: true
    },
    {
      id: 2,
      zone_request_form_id: this.zoneReqForm.id,
      zone: this.zones[1],
      quota: 15,
      available_for_allocation: true,
      available_for_request: true
    },
    {
      id: 3,
      zone_request_form_id: this.zoneReqForm.id,
      zone: this.zones[2],
      quota: 20,
      available_for_allocation: true,
      available_for_request: true
    }
  ]
  persons: Person[] = [
    {
      id: 1,
      first_name: 'John',
      last_name: 'Doe',
      email_address: 'john.doe@gmail.com',
      country: null,
      positions: [],
      images: []
    },
    {
      id: 2,
      first_name: 'Jane',
      last_name: 'Doe',
      email_address: 'jane.doe@gmail.com',
      country: null,
      positions: [],
      images: []
    },
    {
      id: 3,
      first_name: 'John',
      last_name: 'Smith',
      email_address: 'john.smith@gmail.com',
      country: null,
      positions: [],
      images: []
    }
  ];
  personAccreditations: PersonAccreditation[] = [
    {
      id: 1,
      person: this.persons[0],
      random_hash: '9188d942-66bb-4c23-af98-58c76aeb24cb',
      event: null,
      person_position: null,
      position: 'Media',
      member: null,
      skill: null,
      organization: {
        id: 1,
        name: {
          text: 'RSK Provision',
          lang_code: 'en',
          translations: null
        }
      },
      organization_name: 'RSK Provision',
      position_delegate_type: null,
      delegate_type: null,
      group_name: null,
      lines: null,
      printed: null,
      image: null,
      package_option_zones: [],
      zones_add: [],
      zones_remove: [],
      summary: null,
      deleted: false,
      distributed: null
    },
    {
      id: 2,
      person: this.persons[1],
      random_hash: '9188d942-66bb-4c23-af98-58c76aeb24cb',
      event: null,
      person_position: null,
      position: 'Media',
      member: null,
      skill: null,
      organization: {
        id: 2,
        name: {
          text: 'CCTV',
          lang_code: 'en',
          translations: null
        }
      },
      organization_name: 'CCTV',
      position_delegate_type: null,
      delegate_type: null,
      group_name: null,
      lines: null,
      printed: null,
      image: null,
      package_option_zones: [],
      zones_add: [],
      zones_remove: [],
      summary: null,
      deleted: false,
      distributed: null
    },
    {
      id: 3,
      person: this.persons[2],
      random_hash: '9188d942-66bb-4c23-af98-58c76aeb24cb',
      event: null,
      person_position: null,
      position: 'Media',
      member: null,
      skill: null,
      organization: {
        id: 3,
        name: {
          text: 'Astro Malaysia',
          lang_code: 'en',
          translations: null
        }
      },
      organization_name: 'Astro Malaysia',
      position_delegate_type: null,
      delegate_type: null,
      group_name: null,
      lines: null,
      printed: null,
      image: null,
      package_option_zones: [],
      zones_add: [],
      zones_remove: [],
      summary: null,
      deleted: false,
      distributed: null
    },
  ];
  zoneRequests: ZoneRequest[] = [
    {
      id: 1,
      request_date: '2024-08-20',
      person_accreditation: this.personAccreditations[0],
      first_choice_zone: this.zones[0],
      second_choice_zone: this.zones[1],
      objective: 'I want to be close to the winners circle',
      zone_request_form: this.zoneReqForm
    },
    {
      id: 2,
      request_date: '2024-08-21',
      person_accreditation: this.personAccreditations[1],
      first_choice_zone: this.zones[1],
      second_choice_zone: this.zones[2],
      objective: 'I want to be close to the media platform',
      zone_request_form: this.zoneReqForm
    },
    {
      id: 3,
      request_date: '2024-08-22',
      person_accreditation: this.personAccreditations[2],
      first_choice_zone: this.zones[2],
      second_choice_zone: this.zones[0],
      objective: 'I want to be close to the video position',
      zone_request_form: this.zoneReqForm
    }
  ]
  allocations: ZoneRequestAllocation[] = [
    {
      id: 1,
      zone_request: this.zoneRequests[0],
      allocated_zone: this.zones[0],
      allocated_at: '2024-08-21',
      allocated_by_person_id: 1,
      notification_sent_at: null,
      wristband_distributed_at: null
    },
    {
      id: 2,
      zone_request: this.zoneRequests[1],
      allocated_zone: this.zones[1],
      allocated_at: '2024-08-22',
      allocated_by_person_id: 2,
      notification_sent_at: null,
      wristband_distributed_at: null
    }
  ]

  readonly url = (eventId: number) => {
    return `${environment.worldskillsApiAccreditation}/events/${eventId}/zone-requests`
  };

  constructor(private http: HttpClient) {
    super();
  }

  getZonesForForm(zoneReqFormid: number): Zone[] {
    return this.zoneReqFormZone.filter(zone => zone.zone_request_form_id === zoneReqFormid)
      .map(res => this.zones.find(zone => zone.id === res.zone.id) ?? null);
  }

  getZoneReqMappingForForm(zoneReqFormid: number): ZoneRequestFormZone[] {
    return this.zoneReqFormZone.filter(zone => zone.zone_request_form_id === zoneReqFormid);
  }

  getRequestsForForm(zoneReqFormid: number): ZoneRequest[] {
    const allocations = this.getAllocationsForForm(zoneReqFormid);
    return this.zoneRequests.filter(request => request.zone_request_form.id === zoneReqFormid
      && !allocations.some(allocation => allocation.zone_request.id === request.id));
  }

  getAllocationsForForm(zoneReqFormid: number): ZoneRequestAllocation[] {
    return this.allocations.filter(allocation => allocation.zone_request.zone_request_form.id === zoneReqFormid);
  }

  // ------------------- API calls -------------------
  requestZone(eventId: number, zoneReqFormId: number, request: ZoneRequest): Observable<ZoneRequest> {
    return this.http.post<ZoneRequest>(this.url(eventId) + `/form/${zoneReqFormId}`, request);
  }

  getRequest(eventId: number, zoneReqId: number): Observable<ZoneRequest> {
    return this.http.get<ZoneRequest>(this.url(eventId) + `/${zoneReqId}`);
  }

  getRequests(eventId: number, zoneReqFormId: number): Observable<ZoneRequestContainer> {
    return this.http.get<ZoneRequestContainer>(this.url(eventId) + `/form/${zoneReqFormId}`);
  }
}
