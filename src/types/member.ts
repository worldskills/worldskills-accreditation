import {I18nText} from "@worldskills/worldskills-angular-lib";

export interface Member {
  id: number;
  name: I18nText;
  code: string;
}

export interface MemberContainer {
  members: Member[];
}
