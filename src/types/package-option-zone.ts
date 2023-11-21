import {PackageOption} from "./package-option";
import {Zone} from "./zone";

export interface PackageOptionZone {
  id: number;
  package_option: PackageOption;
  zone: Zone;
}
