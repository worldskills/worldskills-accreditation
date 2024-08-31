import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { RegistrationPerson } from '../../types/registration-person';
import { RegistrationHostInfo } from 'src/types/registration-host-info';

@Injectable({
  providedIn: 'root'
})
export class RegistrationsService {

  constructor(private http: HttpClient) { }

  getHostInfo(eventId: number): Observable<RegistrationHostInfo> {
    let url = `${environment.worldskillsApiRegistrations}/manage/events/${eventId}/host_info`;
    return this.http.get<RegistrationHostInfo>(url);
  }

  getRegisteredGroupPerson(eventId: number, groupId: number, registrationId: number): Observable<RegistrationPerson> {
    let url = `${environment.worldskillsApiRegistrations}/register/events/${eventId}/groups/${groupId}/internal/registered_people/${registrationId}`;
    return this.http.get<RegistrationPerson>(url);
  }

}
