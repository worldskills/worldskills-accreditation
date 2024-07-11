import {Zone} from "../zone";
import {ZoneRequest} from "./zone-request";
import {ZoneRequestForm} from "./zone-request-form";
import {PersonAccreditation} from "../person-accreditation";

export interface ZoneRequestAllocation {
  id: number;
  form: ZoneRequestForm;
  zone_request: ZoneRequest;
  manual_allocation_to_person_accreditation: PersonAccreditation;
  allocated_zone: Zone;
  allocated_zone_spot_label: number;
  allocated_at: string;
  allocated_by_person_id: number;
  notification_sent_at: string;
  wristband_distributed_at: string;
}

export interface ZoneRequestAllocationContainer {
  allocations: ZoneRequestAllocation[];
}
