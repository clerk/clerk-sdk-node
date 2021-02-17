import type {
  SessionJSON,
  SessionResource,
} from "./Base";

export class Session implements SessionResource {
  id: string
  clientId: string;
  userId: string;
  status: string;
  lastActiveAt: number;
  expireAt: number;
  abandonAt: number;

  constructor(data: SessionJSON) {
    this.id = data.id;
    this.clientId = data.client_id;
    this.userId = data.user_id;
    this.status = data.status;
    this.lastActiveAt = data.last_active_at;
    this.expireAt = data.expire_at;
    this.abandonAt = data.abandon_at;
  }
}
