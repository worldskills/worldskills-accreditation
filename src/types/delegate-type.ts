import {I18nText, WsEntityModel} from "@worldskills/worldskills-angular-lib";
import {Zone} from "./zone";

export interface DelegateType {
  id: number;
  code: string;
  name: I18nText;
  line1: string;
  line2: string;
  line3: string;
  color: string;
  text_color: string;
  zones: Zone[];
  wsEntity: WsEntityModel;
  checked?: boolean;
}

export interface DelegateTypeContainer {
  delegate_types: DelegateType[];
}
