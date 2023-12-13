import {I18nText} from "@worldskills/worldskills-angular-lib";

export interface Skill {
  id: number;
  skill_number: string;
  name: I18nText;
}

export interface SkillContainer {
  skills: Skill[];
}
