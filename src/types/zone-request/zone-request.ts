import {PersonAccreditation} from "../person-accreditation";
import {Zone} from "../zone";
import {ZoneRequestForm} from "./zone-request-form";
import {FetchParams} from "@worldskills/worldskills-angular-lib";

export interface ZoneRequest {
  id?: number;
  request_date?: string;
  person_accreditation?: PersonAccreditation;
  first_choice_zone: Zone;
  second_choice_zone: Zone;
  objective: string;
  zone_request_form: ZoneRequestForm;
}

export interface ZoneRequestContainer {
  zone_requests: ZoneRequest[];
}

export interface ZoneRequestReqParams extends FetchParams {
  allocated?: boolean;
  zone_id?: number;
  org_id?: number;
  export?: boolean;
}
