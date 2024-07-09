export enum ZoneRequestFormEmailType {
  FROM = 'FROM',
  MANAGER = 'MANAGER'
}

export interface ZoneRequestFormEmail {
  id: number;
  zone_request_form_id: number;
  email_address: string;
  type: ZoneRequestFormEmailType;
}

export interface ZoneRequestFormEmailContainer {
  emails: ZoneRequestFormEmail[];
}
