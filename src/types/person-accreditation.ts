import {Person} from "./person";
import {Event} from "./event";
import {PersonPosition} from "./person-position";
import {Member} from "./member";
import {Skill} from "./skill";
import {Organization} from "./organization";
import {PositionDelegateType} from "./position-delegate-type";
import {DelegateType} from "./delegate-type";
import {Image} from "./image";
import {PackageOptionZone} from "./package-option-zone";
import {Zone} from "./zone";
import {PersonAccreditationSummary} from "./person-accreditation-summary";

export interface PersonAccreditation {
  id: number;
  person: Person;
  random_hash: string;
  event: Event;
  person_position: PersonPosition;
  position: string;
  member: Member;
  skill: Skill;
  organization: Organization;
  organization_name: string;
  position_delegate_type: PositionDelegateType;
  delegate_type: DelegateType;
  group_name: string;
  lines: string;
  printed: Date;
  image: Image;
  package_option_zones: PackageOptionZone[];
  zones_add: Zone[];
  zones_remove: Zone[];
  summary: PersonAccreditationSummary;
  deleted: boolean;
}
