import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Log, LogList } from 'src/types/log';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LogsService {

  constructor(private http: HttpClient) { }

  getLogs(params: {}): Observable<LogList> {
    let url = `${environment.worldskillsApiLogs}`;
    return this.http.get<LogList>(url, {params});
  }

}
