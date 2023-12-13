// TODO: should this be in lib?
export class APIError {
  code: string;
  user_msg: string;
  dev_msg: string;
  errors: any;

  constructor(obj?: any) {
    this.code = obj && obj.code || null;
    this.user_msg = obj && obj.user_msg || null;
    this.dev_msg = obj && obj.dev_msg || null;
    this.errors = obj && obj.errors || null;
  }
}
