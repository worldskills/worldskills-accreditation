import {PersonAccreditationSummary} from "./person-accreditation-summary";
import {Zone} from "./zone";
import {FetchParams} from "@worldskills/worldskills-angular-lib";

export interface PersonAccreditationScan {
  allowed: boolean;
  accreditation: PersonAccreditationSummary;
  zone: Zone;
  timestamp: Date;
}

export interface PersonAccreditationScanContainer {
  scans: PersonAccreditationScan[];
  total_count: number;
}

export interface PersonAccreditationScanReqParams extends FetchParams {
  eventId: number;
  zone: number;
  position: number;
  member: number;
  accreditation: number;
  from: string;
  to: string;
}
