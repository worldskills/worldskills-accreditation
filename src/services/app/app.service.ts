import {Injectable} from '@angular/core';
import {Event} from "../../types/event";
import {BehaviorSubject, ReplaySubject, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AppService {

  showBreadcrumbs: Subject<boolean> = new Subject<boolean>();
  showMenuTabs: Subject<boolean> = new Subject<boolean>();
  showWSLayout: Subject<boolean> = new Subject<boolean>();
  selectedEvent = new ReplaySubject<Event>(1);
  initialized: boolean;

  badgePerPage: BehaviorSubject<number> = new BehaviorSubject<number>(2);

  constructor() {
  }
}
