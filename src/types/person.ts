import {Country} from "./country";
import {PersonPosition} from "./person-position";
import {Image} from "./image";

export interface Person {
  id: number;
  first_name: string;
  last_name: string;
  email_address: string;
  country: Country;
  positions: PersonPosition[];
  images: Image[];
}
