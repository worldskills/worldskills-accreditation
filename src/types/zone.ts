export interface Zone {
  id: number;
  code: string;
  name: string;
  color: string;
  text_color: string;
  sort: number;
}

export interface ZoneContainer {
  zones: Zone[];
}
