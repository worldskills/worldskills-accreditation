import {Zone} from "./zone";

export interface DelegateType {
  id: number;
  code: string;
  name: string;
  line1: string;
  line2: string;
  line3: string;
  color: string;
  text_color: string;
  zones: Zone[];
  checked?: boolean;
}

export interface DelegateTypeContainer {
  delegate_types: DelegateType[];
}
