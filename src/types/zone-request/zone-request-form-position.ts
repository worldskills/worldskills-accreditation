import {Position} from "../position";

export enum ZoneRequestFormPositionType {
  NEW_PERSON_MANUAL_ALLOCATION = 'NEW_PERSON_MANUAL_ALLOCATION',
}

export interface ZoneRequestFormPosition {
  id: number;
  zone_request_form_id: number;
  position: Position;
  type: ZoneRequestFormPositionType;
}

export interface ZoneRequestFormPositionContainer {
  positions: ZoneRequestFormPosition[];
}
