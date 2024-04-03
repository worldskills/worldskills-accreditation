import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Person } from 'src/types/person';

@Injectable({
  providedIn: 'root'
})
export class PeopleService {

  constructor(private http: HttpClient) { }

  getPerson(personId: number): Observable<Person> {
    let url = `${environment.worldskillsApiPeople}/person/${personId}`;
    return this.http.get<Person>(url);
  }

}
