import {Position} from "./position";
import {DelegateType} from "./delegate-type";

export interface PositionDelegateType {
  position: Position;
  delegate_type: DelegateType;
}

export interface PositionDelegateTypeContainer {
  positions: PositionDelegateType[];
}
