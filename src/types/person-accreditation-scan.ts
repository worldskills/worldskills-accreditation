import {PersonAccreditationSummary} from "./person-accreditation-summary";
import {Zone} from "./zone";

export interface PersonAccreditationScan {
  allowed: boolean;
  accreditation: PersonAccreditationSummary;
  zone: Zone;
  timestamp: Date;
}

export interface PersonAccreditationScanContainer {
  scans: PersonAccreditationScan[];
}

export interface PersonAccreditationScanReqParams {
  eventId: number;
  zone: number;
  delegate_type: number;
  member: number;
  accreditation: number;
  from: string;
  to: string;
}
