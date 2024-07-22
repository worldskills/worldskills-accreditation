import {I18nText} from "@worldskills/worldskills-angular-lib";
import { Zone } from "./zone";

export interface PackageOption {
  id: number;
  type: string;
  name: I18nText;
  description: I18nText;
  start: Date;
  end: Date;
  zones: Zone[];
}

export interface PackageOptionContainer {
  options: PackageOption[];
}
