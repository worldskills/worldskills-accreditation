
export interface VehicleGroup {
  id?: number;
  name: string;
}

export interface VehicleGroupList {
  groups: VehicleGroup[];
  total_count: number;
}
