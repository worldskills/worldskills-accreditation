import {I18nText} from "@worldskills/worldskills-angular-lib";

export interface PackageOption {
  id: number;
  type: string;
  name: I18nText;
  description: I18nText;
  start: Date;
  end: Date;
}

export interface PackageOptionContainer {
  options: PackageOption[];
}
