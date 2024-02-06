import {ZoneRequestForm} from "./zone-request-form";
import {Zone} from "../zone";

export interface ZoneRequestFormZone {
  id: number;
  zone_request_form: ZoneRequestForm;
  zone: Zone;
  quota: number;
}
