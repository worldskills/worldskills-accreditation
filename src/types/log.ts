import { Person } from "./person";

export interface Log {
  id: number;
  code: number;
  message: string;
  occured: Date;
  person_id: number;
  person?: Person;
}

export interface LogList {
  logs: Log[];
}
