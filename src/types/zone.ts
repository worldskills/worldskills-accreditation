export interface Zone {
  id: number;
  code: string;
  name: string;
  color: string;
  text_color: string;
  quota?: number;
  usage?: number;
  sort: number;
}

export interface ZoneContainer {
  zones: Zone[];
}
