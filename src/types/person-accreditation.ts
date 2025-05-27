import {Person} from "./person";
import {Event} from "./event";
import {PersonPosition} from "./person-position";
import {Position} from "./position";
import {Image} from "./image";
import {PackageOptionZone} from "./package-option-zone";
import {Zone} from "./zone";
import {PersonAccreditationSummary} from "./person-accreditation-summary";
import { PersonRegistration } from "./person-registration";

export interface PersonAccreditation {
  id: number;
  person: Person;
  first_name: string;
  last_name: string;
  random_hash: string;
  event: Event;
  person_position: PersonPosition;
  position: Position;
  lines: string;
  printed: Date;
  image: Image;
  registration: PersonRegistration;
  package_option_zones: PackageOptionZone[];
  zones_add: Zone[];
  zones_remove: Zone[];
  summary: PersonAccreditationSummary;
  deleted: boolean;
  distributed: Date;
}
