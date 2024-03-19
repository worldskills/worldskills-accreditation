import {Zone} from "../zone";
import {ZoneRequest} from "./zone-request";

export interface ZoneRequestAllocation {
  id: number;
  zone_request: ZoneRequest;
  allocated_zone: Zone;
  allocated_zone_spot_label: string;
  allocated_at: string;
  allocated_by_person_id: number;
  notification_sent_at: string;
  wristband_distributed_at: string;
}

export interface ZoneRequestAllocationContainer {
  allocations: ZoneRequestAllocation[];
}
