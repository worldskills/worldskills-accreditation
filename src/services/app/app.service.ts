import {Injectable} from '@angular/core';
import {Event} from "../../types/event";
import {ReplaySubject, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AppService {

  showBreadcrumbs: Subject<boolean> = new Subject<boolean>();
  showWSLayout: Subject<boolean> = new Subject<boolean>();
  selectedEvent = new ReplaySubject<Event>(1);
  initialized: boolean;

  constructor() {
  }
}
