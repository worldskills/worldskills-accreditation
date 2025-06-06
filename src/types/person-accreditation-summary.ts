import {Skill} from "./skill";
import {Sector} from "./sector";
import {Member} from "./member";
import {Country} from "./country";
import {Image} from "./image";
import {Position} from "./position";
import {Zone} from "./zone";
import {FetchParams} from "@worldskills/worldskills-angular-lib";

export interface PersonAccreditationSummary {
  id: number;
  person_id: number;
  first_name: string;
  last_name: string;
  lines: string[];
  email_address: string;
  date_of_birth: Date;
  details: string;
  skill: Skill;
  sector: Sector;
  member: Member;
  country: Country;
  organization: string;
  group_name: string;
  image: Image;
  position: Position;
  host_info_status: string;
  random_hash: string;
  qr_code: string;
  zones: Zone[];
  custom_field_data: Map<string, string>;
  checked?: boolean;
}

export interface PersonAccreditationSummaryContainer {
  people: PersonAccreditationSummary[];
  total_count: number;
}

export interface PersonAccreditationSummaryReqParams extends FetchParams {
  name?: string;
  country?: string;
  member?: number;
  pos_id?: number;
  pos_name?: string;
  skill?: number;
  group?: string;
  zone?: number[];
  printed?: boolean;
  distributed?: boolean;
  overridden?: boolean;
  photo?: boolean;
  positions?: number[];
  sort?: string;
}
