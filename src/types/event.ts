import {I18nText, WsEntityModel} from "@worldskills/worldskills-angular-lib";

export interface Event {
  id: number;
  name: I18nText;
  ws_entity: WsEntityModel;
  start_date: Date;
  end_date: Date;
  type: string;
  member_id?: number;
  require_host_approval: boolean;
}

export interface EventContainer {
  events: Event[];
  total_count: number;
}

export interface EventConfig {
  event_id: number;
  qr_code: string;
}
