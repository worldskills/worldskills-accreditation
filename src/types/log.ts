
export interface Log {
  id: number;
  code: number;
  message: string;
  occured: Date;
}

export interface LogList {
  logs: Log[];
}
