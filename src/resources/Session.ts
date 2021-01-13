import type {
  SessionJSON,
  SessionResource,
} from "../types/resources";

export class Session implements SessionResource {
  id: string;
  status: string;
  expireAt: Date;
  abandonAt: Date;
  user: any;

  constructor(data: SessionJSON) {
    this.id = data.id;
    this.status = data.status;
    this.expireAt = new Date(data.expire_at * 1000);
    this.abandonAt = new Date(data.abandon_at * 1000);
  }
}
