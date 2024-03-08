import {I18nText} from "@worldskills/worldskills-angular-lib";
import {ZoneRequestFormZone} from "./zone-request-form-zone";

export interface ZoneRequestForm {
  id: number;
  random_hash: string;
  event_id: number;
  name: I18nText;
  header_text: I18nText;
  open_for_request: boolean;
  zones: ZoneRequestFormZone[];
}

export interface ZoneRequestFormContainer {
  zone_request_forms: ZoneRequestForm[];
}
