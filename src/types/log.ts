import { Person } from "./person";

export interface Log {
  id: number;
  code: number;
  message: string;
  occured: Date;
  data: object;
  person_id: number;
  puppeteer_id: number;
  person?: Person;
  puppeteer?: Person;
}

export interface LogList {
  logs: Log[];
}
