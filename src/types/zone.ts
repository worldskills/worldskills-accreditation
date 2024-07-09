export interface Zone {
  id: number;
  code: string;
  name: string;
  color: string;
  text_color: string;
  quota?: number;
  usage?: number;
  available_person_accreditation?: boolean;
  available_vehicle_accreditation?: boolean;
  sort: number;
}

export interface ZoneContainer {
  zones: Zone[];
}
