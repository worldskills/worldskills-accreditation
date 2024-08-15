import {Zone} from "../zone";

export interface ZoneRequestFormZone {
  id?: number;
  zone_request_form_id?: number;
  zone?: Zone;
  quota: number;
  available_for_request: boolean;
  available_for_allocation: boolean;
}
