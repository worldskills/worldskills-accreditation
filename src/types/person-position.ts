import {Position} from "./position";
import {Skill} from "./skill";
import {Sector} from "./sector";
import {Member} from "./member";
import {Organization} from "./organization";

export interface PersonPosition {
  id: number;
  position: Position;
  start: Date;
  end: Date;
  invalid: boolean;
  skill: Skill;
  sector: Sector;
  member: Member;
  organization: Organization;
}
