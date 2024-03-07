import {PersonAccreditation} from "../person-accreditation";
import {Zone} from "../zone";
import {ZoneRequestForm} from "./zone-request-form";

export interface ZoneRequest {
  id?: number;
  request_date?: string;
  person_accreditation?: PersonAccreditation;
  first_choice_zone: Zone;
  second_choice_zone: Zone;
  objective: string;
  zone_request_form: ZoneRequestForm;
}
