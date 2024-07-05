import {DelegateType} from "./delegate-type";
import {Zone} from "./zone";
import { VehicleGroup } from "./vehicle-group";
import { FetchParams } from "@worldskills/worldskills-angular-lib";

export interface VehicleAccreditation {
  id: number;
  vehicle_group: VehicleGroup;
  delegate_type: DelegateType;
  overwrite_lines: string;
  lines: string[];
  random_hash: string;
  qr_code: string;
  zones: Zone[];
  zones_add: Zone[];
  zones_remove: Zone[];
  checked?: boolean;
  printed?: boolean;
  distributed?: boolean;
}

export interface VehicleAccreditationList {
  vehicles: VehicleAccreditation[];
  total_count: number;
}

export interface VehicleAccreditationRequest {
  vehicle_group_id?: number;
  delegate_type_id?: number;
  quantity?: number;
}

export interface VehicleAccreditationFetchParams extends FetchParams {
  query?: string;
  zone?: number[];
  printed?: boolean;
  distributed?: boolean;
  del_types?: number[];
  sort?: string;
}
